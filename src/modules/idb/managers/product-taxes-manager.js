import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import ProductTax from '../model/product-tax';

var productTaxesStore = storeManager.getStore(STORES.productTaxes),
  syncParams;

syncParams = {
  store: productTaxesStore,
  entity: VERSIONED_ENTITIES.productTaxes,
  syncDeleted: true,
  model: ProductTax,
  key: 'taxId'
};

export default class ProductTaxesManager {
  static get(taxId) {
    return productTaxesStore.get(taxId);
  }

  static getAll() {
    return productTaxesStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
