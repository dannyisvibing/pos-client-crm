import _ from 'lodash';
import PRODUCT_FILTERS from '../../../constants/stocktake/product-filters';
import ProductFilter from '../model/product-filter';
import storeManager from './store-manager';
import productsManager from './products-manager';
import syncManager from './sync-manager';

export default class ProductFiltersManager {
  static sync() {
    var promises = [],
      productFilters = _.map(PRODUCT_FILTERS, 'key'),
      filterEntities = _.map(PRODUCT_FILTERS, 'entityKey');

    _.forEach(productFilters, function(filterType, index) {
      var params;

      if (filterType === PRODUCT_FILTERS.products.key) {
        promises.push(productsManager.sync());
      } else {
        params = {
          store: storeManager.getStore(filterType),
          model: ProductFilter,
          entity: filterEntities[index],
          apiParams: {
            mockup: window.SIMULATE_SYNC
          }
        };

        promises.push(syncManager.syncStore(params));
      }
    });

    return Promise.all(promises);
  }

  static getAllFilters() {
    var promises = [],
      productFilters = _.map(PRODUCT_FILTERS, 'key'),
      result = {};

    _.forEach(productFilters, function(filterType) {
      var filterStore = storeManager.getStore(filterType);
      promises.push(filterStore.getAll());
    });

    return Promise.all(promises).then(data => {
      _.forEach(productFilters, function(filterType, index) {
        result[filterType] = data[index];
      });

      return result;
    });
  }

  static getFilter(filterType, filterId) {
    var filterStore = storeManager.getStore(filterType);

    return filterStore.get(filterId).then(function(filterData) {
      if (!filterData.name) {
        filterData = new ProductFilter({
          name: 'DELETED' + filterType.slice(0, -1).toUpperCase()
        });
      }

      return filterData;
    });
  }

  static getFilterByIds(filterType, filterIds) {
    var manager = this,
      promises = [];

    _.forEach(filterIds, function(filterId) {
      promises.push(
        manager.getFilter(filterType, filterId).then(function(record) {
          record.type = filterType;
          return record;
        })
      );
    });

    return Promise.all(promises);
  }
}
