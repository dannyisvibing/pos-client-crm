import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import Customer from '../model/customer';

var customersStore = storeManager.getStore(STORES.customers),
  syncParams;

syncParams = {
  store: customersStore,
  entity: VERSIONED_ENTITIES.customers,
  syncDeleted: true,
  model: Customer
};

export default class CustomersManager {
  static get(id) {
    return customersStore.get(id);
  }

  static getAll() {
    return customersStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
