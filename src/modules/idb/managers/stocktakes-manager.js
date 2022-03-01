import storeManager from './store-manager';
import syncManager from './sync-manager';
import Stocktake from '../model/stocktake';
import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';

var stocktakesStore = storeManager.getStore(STORES.stocktakes);

export default class StocktakesManager {
  static sync() {
    var params = {
      store: storeManager.getStore(STORES.stocktakes),
      entity: VERSIONED_ENTITIES.consignments,
      apiParams: {
        pageSize: 200
      },
      model: Stocktake,
      filter: function(stocktake) {
        return stocktake.type === 'stocktake';
      }
    };

    return syncManager.syncStore(params);
  }

  static getAll() {
    return stocktakesStore.getAll();
  }

  static get(stocktakeId) {
    return stocktakesStore.get(stocktakeId);
  }
}
