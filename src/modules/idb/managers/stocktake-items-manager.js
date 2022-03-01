import _ from 'lodash';
import VERSIONED_ENTITIES from '../versioned-entities';
import StocktakeItem from '../model/stocktake-item';
import storeManager from './store-manager';
import productsManager from './products-manager';
import STORES from '../stores';
import stocktakeItemResource from '../../../app/ManageInventoryCount/legacy/api';
import syncManager from './sync-manager';

export default class StocktakeItemsManager {
  static _getStore() {
    return storeManager.getStore(STORES.stocktakeItems);
  }

  static _getEntityName(stocktakeId) {
    return VERSIONED_ENTITIES.consignmentProducts.replace(':id', stocktakeId);
  }

  static sync(stocktakeId, pageSuccess) {
    var params = {
      store: this._getStore(),
      entity: this._getEntityName(stocktakeId),
      apiParams: {
        pageSize: 10000
      },
      pageSuccess: pageSuccess,
      extraObjectData: {
        stocktakeId: stocktakeId
      },
      model: StocktakeItem
    };

    return syncManager.syncStore(params);
  }

  static deleteAll(stocktakeId) {
    var store = this._getStore(),
      promises = [];
    return store
      .getByIndex('ByStocktakeId', stocktakeId)
      .then(function(stocktakeItems) {
        _.forEach(stocktakeItems, function(stocktakeItem) {
          promises.push(store.delete(stocktakeItem.id));
        });

        return Promise.all(promises);
      });
  }

  static getAll(stocktakeId) {
    var store = this._getStore();
    return store.getByIndex('ByStocktakeId', stocktakeId);
  }

  static insert(stocktakeItem) {
    var store = this._getStore();
    return store.insert(stocktakeItem.id, stocktakeItem);
  }

  static delete(stocktakeItemId) {
    return this._getStore().delete(stocktakeItemId);
  }

  static setProducts(stocktakeItems) {
    stocktakeItems = _.filter(stocktakeItems, function(stocktakeItem) {
      return !stocktakeItem.name;
    });

    return productsManager
      .getBatch(_.map(stocktakeItems, 'productId'))
      .then(function(products) {
        _.forEach(stocktakeItems, function(stocktakeItem) {
          stocktakeItem.setProduct(products[stocktakeItem.productId]);
        });
      });
  }

  static pushCounts(stocktakeId, unsyncedStocktakeItems) {
    var manager = this,
      promises = [];

    _.forEach(unsyncedStocktakeItems, function(stocktakeItem) {
      var productData, promise;

      if (stocktakeItem.setSyncing()) {
        productData = {
          product_id: stocktakeItem.productId,
          received: stocktakeItem.getCountedUnsync()
        };
        promise = stocktakeItemResource
          .save(productData, stocktakeId)
          .then(function(response) {
            var sentCountedQty = productData.received,
              syncedCountedQty = response.received,
              unsyncedCountDiff;

            unsyncedCountDiff =
              stocktakeItem.getCountedUnsync() - sentCountedQty;
            stocktakeItem.setCountUnsynced(unsyncedCountDiff);
            stocktakeItem.setCount(syncedCountedQty);
            stocktakeItem.unlockSyncing();

            return manager.insert(stocktakeItem);
          })
          .catch(function(e) {
            stocktakeItem.unlockSyncing();
            return false;
          });

        promises.push(promise);
      }
    });

    return Promise.all(promises);
  }
}
