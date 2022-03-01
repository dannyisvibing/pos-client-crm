import _ from 'lodash';
import STORES from '../stores';
import storeManager from './store-manager';

export default class stocktakeCountsManager {
  static _getStore() {
    return storeManager.getStore(STORES.stocktakeCounts);
  }

  static deleteAll(stocktakeId) {
    var store = this._getStore(),
      promises = [];

    return store
      .getByIndex('ByStocktakeId', stocktakeId)
      .then(function(stocktakeCounts) {
        _.forEach(stocktakeCounts, function(stocktakeCount) {
          promises.push(store.delete(stocktakeCount.getId()));
        });
        return Promise.all(promises);
      });
  }

  static delete(stocktakeCountId) {
    var store = this._getStore();
    return store.delete(stocktakeCountId);
  }

  static insert(stocktakeId, stocktakeCount) {
    var store = this._getStore();
    return store.insert(stocktakeCount.getId(), stocktakeCount);
  }

  static getAll(stocktakeId) {
    var store = this._getStore();
    return store
      .getByIndex('ByStocktakeId', stocktakeId)
      .then(function(counts) {
        return _.sortBy(counts, function(count) {
          return -count.order;
        });
      })
      .catch(function() {
        return [];
      });
  }
}
