import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import Outlet from '../model/outlet';

var outletsStore = storeManager.getStore(STORES.outlets),
  syncParams;

syncParams = {
  store: outletsStore,
  entity: VERSIONED_ENTITIES.outlets,
  syncDeleted: true,
  model: Outlet,
  key: 'outletId'
};

export default class OutletsManager {
  static get(outletId) {
    return outletsStore.get(outletId);
  }

  static getAll() {
    return outletsStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
