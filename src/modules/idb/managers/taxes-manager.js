import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import Tax from '../model/tax';

var taxesStore = storeManager.getStore(STORES.taxes),
  syncParams;

syncParams = {
  store: taxesStore,
  entity: VERSIONED_ENTITIES.taxes,
  syncDeleted: true,
  model: Tax,
  key: 'taxId'
};

export default class TaxesManager {
  static get(taxId) {
    return taxesStore.get(taxId);
  }

  static getAll() {
    return taxesStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
