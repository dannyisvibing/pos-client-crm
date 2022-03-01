import STORES from '../stores';
import storeManager from './store-manager';
// import PendingSale from '../model/pending-sale';

export default class SettingsManager {
  static get(id) {
    const store = storeManager.getStore(STORES.settings);
    return store.get(id);
  }

  static getAll() {
    const store = storeManager.getStore(STORES.settings);
    return store.getAll();
  }

  static insert(id, setting) {
    const store = storeManager.getStore(STORES.settings);
    return store.insert(id, setting);
  }

  static delete(id) {
    const store = storeManager.getStore(STORES.settings);
    return store.delete(id);
  }
}
