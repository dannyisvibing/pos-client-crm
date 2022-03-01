import STORES from '../stores';
import storeManager from './store-manager';
// import PendingSale from '../model/pending-sale';

export default class PendingSaleManager {
  static get(id) {
    const store = storeManager.getStore(STORES.pendingSale);
    return store.get(id);
  }

  static getAll() {
    const store = storeManager.getStore(STORES.pendingSale);
    return store.getAll();
  }

  static insert(id, pendingSale) {
    const store = storeManager.getStore(STORES.pendingSale);
    return store.insert(id, pendingSale);
  }

  static delete(id) {
    const store = storeManager.getStore(STORES.pendingSale);
    return store.delete(id);
  }
}
