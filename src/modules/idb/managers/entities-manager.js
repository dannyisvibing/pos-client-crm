import _ from 'lodash';
import STORES from '../stores';
import MANAGABLE_ENTITIES from '../managable-entities';
import stocktakeConfig from '../utils/stocktake-config';
import storeManager from './store-manager';
import outletManager from './outlets-manager';
import registerManager from './registers-manager';
import productFilterManager from './product-filters-manager';
import productsManager from './products-manager';
import productTaxesManager from './product-taxes-manager';
import pricebooksManager from './pricebooks-manager';
import pricebookProductsManager from './pricebook-products-manager';
import usersManager from './users-manager';
import customersManager from './customers-manager';
import customerGroupsManager from './customer-groups-manager';

import stocktakesManager from './stocktakes-manager';
import stocktakeItemsManager from './stocktake-items-manager';
import stocktakeCountsManager from './stocktake-counts-manager';
import taxesManager from './taxes-manager';
import syncManager from './sync-manager';

var managers = {},
  DATABASE_VERSION = '1';

managers[MANAGABLE_ENTITIES.products] = productsManager;
managers[MANAGABLE_ENTITIES.taxes] = taxesManager;
managers[MANAGABLE_ENTITIES.outlets] = outletManager;
managers[MANAGABLE_ENTITIES.productTaxes] = productTaxesManager;
managers[MANAGABLE_ENTITIES.pricebooks] = pricebooksManager;
managers[MANAGABLE_ENTITIES.priceBookProducts] = pricebookProductsManager;
managers[MANAGABLE_ENTITIES.registers] = registerManager;
managers[MANAGABLE_ENTITIES.users] = usersManager;
managers[MANAGABLE_ENTITIES.customers] = customersManager;
managers[MANAGABLE_ENTITIES.customerGroups] = customerGroupsManager;
managers[MANAGABLE_ENTITIES.productFilters] = productFilterManager;
managers[MANAGABLE_ENTITIES.stocktakes] = stocktakesManager;
managers[MANAGABLE_ENTITIES.stocktakeItems] = stocktakeItemsManager;
managers[MANAGABLE_ENTITIES.stocktakeCounts] = stocktakeCountsManager;

export default class EntitiesManager {
  static _getEntityManager(managableEntity) {
    return managers[managableEntity];
  }

  static getTaxManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.taxes);
  }

  static getStocktakesManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.stocktakes);
  }

  static getStocktakeItemsManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.stocktakeItems);
  }

  static getStocktakeCountsManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.stocktakeCounts);
  }

  static getOutletsManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.outlets);
  }

  static getProductFiltersManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.productFilters);
  }

  static getProductsManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.products);
  }

  static getProductTaxesManager() {
    return this._getEntityManager(MANAGABLE_ENTITIES.productTaxes);
  }

  static dropDatabase() {
    return Promise.all(
      _.values(STORES, store => {
        return storeManager.getStore(store).clear();
      })
    ).then(() => {
      stocktakeConfig.unsetInitialSync();
      stocktakeConfig.setDatabaseVersion('0');
    });
  }

  static syncAllForInventoryCount() {
    return this._clearIfNewerVersions().then(() => {
      if (!stocktakeConfig.getInitialSync()) {
        // To Do - Show loading light box
      }
      return this.syncEntities([
        MANAGABLE_ENTITIES.stocktakes,
        MANAGABLE_ENTITIES.outlets,
        MANAGABLE_ENTITIES.productFilters
      ])
        .then(() => {
          stocktakeConfig.setInitialSync(true);
          // To Do - Dismiss loading light box
        })
        .catch(error => {
          // To Do - Dismiss loading light box
          return Promise.reject(error);
        });
    });
  }

  static syncAllForWebRegister() {
    return this._clearIfNewerVersions().then(() => {
      return this.syncEntities([
        MANAGABLE_ENTITIES.products,
        MANAGABLE_ENTITIES.taxes,
        MANAGABLE_ENTITIES.outlets,
        MANAGABLE_ENTITIES.productTaxes,
        MANAGABLE_ENTITIES.pricebooks,
        MANAGABLE_ENTITIES.registers,
        MANAGABLE_ENTITIES.users,
        MANAGABLE_ENTITIES.customers,
        MANAGABLE_ENTITIES.customerGroups,
        MANAGABLE_ENTITIES.productFilters
      ])
        .then(() => {
          // To Do - Dismiss loading light box
        })
        .catch(error => {
          // To Do - Dismiss loading light box
          return Promise.reject(error);
        });
    });
  }

  static _clearIfNewerVersions() {
    var dbVersion = stocktakeConfig.getDatabaseVersion();
    if (dbVersion !== DATABASE_VERSION) {
      return this.dropDatabase().then(() => {
        stocktakeConfig.setDatabaseVersion(DATABASE_VERSION);
        return true;
      });
    } else {
      return Promise.resolve();
    }
  }

  static syncEntities(entities) {
    var promises;
    return syncManager.requestMaxVersions().then(() => {
      promises = _.map(entities, value => {
        return this._getEntityManager(value).sync();
      });
      return Promise.all(promises);
    });
  }
}
