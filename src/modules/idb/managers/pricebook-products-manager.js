import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import PriceBookProduct from '../model/price-book-product';

var priceBookProductsStore = storeManager.getStore(STORES.priceBookProducts),
  syncParams;

export default class PriceBookProductsManager {
  static _getEntityName(bookId) {
    return VERSIONED_ENTITIES.pricebookProducts.replace(':id', bookId);
  }

  static get(itemId) {
    return priceBookProductsStore.get(itemId);
  }

  static getAll() {
    return priceBookProductsStore.getAll();
  }

  static sync(bookId) {
    syncParams = {
      store: priceBookProductsStore,
      entity: this._getEntityName(bookId),
      syncDeleted: true,
      model: PriceBookProduct,
      key: 'itemId'
    };

    return syncManager.syncStore(syncParams);
  }
}
