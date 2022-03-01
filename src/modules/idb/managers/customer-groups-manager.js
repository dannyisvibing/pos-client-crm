import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import CustomerGroup from '../model/customer-group';

var customerGroupsStore = storeManager.getStore(STORES.customerGroups),
  syncParams;

syncParams = {
  store: customerGroupsStore,
  entity: VERSIONED_ENTITIES.customerGroups,
  syncDeleted: true,
  model: CustomerGroup
};

export default class CustomerGroupsManager {
  static get(id) {
    return customerGroupsStore.get(id);
  }

  static getAll() {
    return customerGroupsStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
