import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import Register from '../model/register';

var registersStore = storeManager.getStore(STORES.registers),
  syncParams;

syncParams = {
  store: registersStore,
  entity: VERSIONED_ENTITIES.registers,
  syncDeleted: true,
  model: Register,
  key: 'registerId'
};

export default class RegistersManager {
  static get(registerId) {
    return registersStore.get(registerId);
  }

  static getAll() {
    return registersStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
