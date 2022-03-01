import _ from 'lodash';
import VERSIONED_ENTITIES from '../versioned-entities';
import Product from '../model/product';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import STORES from '../stores';

const productsStore = storeManager.getStore(STORES.products);

export default class ProductsManager {
  static clearProducts() {
    var versionStore = storeManager.getStore(STORES.versions);

    return Promise.all([productsStore.clear(), versionStore.delete()]);
  }

  static getAll(revive) {
    return productsStore.getAll(revive);
  }

  static getBatch(ids) {
    var self = this;

    return productsStore
      .getBatch(ids)
      .then(products => _.keyBy(products, 'id'))
      .then(products => {
        return _.mapValues(products, function(product, productId) {
          return product ? product : self.getGenericDeletedProduct(productId);
        });
      });
  }

  static getGenericDeletedProduct(id) {
    return new Product({ id: id, name: 'DELETED PRODUCT' });
  }

  static sync() {
    var params = {
      store: productsStore,
      model: Product,
      entity: VERSIONED_ENTITIES.products,
      apiParams: {
        pageSize: 10000,
        mockup: window.SIMULATE_SYNC
      },
      filter: function(product) {
        return product.hasInventory && !product.isComposite;
      }
    };

    return syncManager.syncStore(params);
  }
}
