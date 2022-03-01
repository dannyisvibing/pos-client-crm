import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import Pricebook from '../model/price-book';

var pricebooksStore = storeManager.getStore(STORES.priceBooks),
  syncParams;

syncParams = {
  store: pricebooksStore,
  entity: VERSIONED_ENTITIES.pricebooks,
  syncDeleted: true,
  model: Pricebook,
  key: 'bookId'
};

export default class OutletsManager {
  static get(bookId) {
    return pricebooksStore.get(bookId);
  }

  static getAll() {
    return pricebooksStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
