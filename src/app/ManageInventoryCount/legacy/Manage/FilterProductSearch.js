import React, { Component } from 'react';
import _ from 'lodash';
import STATES from '../../../../constants/states';
import PRODUCTS_FILTERS from '../../../../constants/stocktake/product-filters';
import productFiltersManager from '../../../../modules/idb/managers/product-filters-manager';
import storeManager from '../../../../modules/idb/managers/store-manager';
import STORES from '../../../../modules/idb/stores';
import { RBLoader } from '../../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import Autocomplete from './Autocomplete';
import FilterTagGroups from './FilterTagGroups';
import FilterProductResult from './FilterProductResult';

const STOCK_CONTROL_NEW_INVENTORY_COUNT_IMAGE = '/img/new-inventory-count.svg';

const typeaheadEntities = [
  {
    title: PRODUCTS_FILTERS.brands.name,
    type: PRODUCTS_FILTERS.brands.key
  },
  {
    title: PRODUCTS_FILTERS.tags.name,
    type: PRODUCTS_FILTERS.tags.key
  },
  {
    title: PRODUCTS_FILTERS.suppliers.name,
    type: PRODUCTS_FILTERS.suppliers.key
  },
  {
    title: PRODUCTS_FILTERS.productTypes.name,
    type: PRODUCTS_FILTERS.productTypes.key
  },
  {
    title: PRODUCTS_FILTERS.products.name,
    type: PRODUCTS_FILTERS.products.key,
    searchFields: ['sku', 'handle', 'supplierCode']
  }
];

const MAX_FILTERS = 25;

class FilterProductSearch extends Component {
  state = {
    autocompleteDisabled: false,
    autocompleteValue: '',
    state: STATES.inProgress,
    productResults: []
  };

  componentWillMount() {
    this.productsStore = storeManager.getStore(STORES.products);
    this.stocktake = this.props.stocktake;
    this.selectedFilters = this.props.selectedFilters;
    this._initProductFilters();
    this._initFilters();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.includeInactive !== nextProps.includeInactive &&
      !nextProps.includeInactive
    ) {
      if (this.selectedFilters.length) {
        this.searchProducts();
        this._removeInactiveProductFilters();
      }
    }
  }

  _initProductFilters() {
    productFiltersManager.getAllFilters().then(filters => {
      this.productFilters = filters;
      this.setState({ state: STATES.ready });
    });
  }

  _initFilters() {
    var promises = [];
    _.forEach(this.selectedFilters, (filterGroup, index) => {
      promises.push(
        productFiltersManager
          .getFilterByIds(filterGroup.type, filterGroup.filters)
          .then(objectFilters => {
            this.selectedFilters[index].filters = objectFilters;
          })
      );
    });

    Promise.all(promises).then(() => {
      this.searchProducts();
    });
  }

  checkFilterLimit() {
    if (this._reachedMaxFilters()) {
      this.setState({
        autocompleteDisabled: true,
        autocompleteValue:
          'You have reached your maximum number of filters (' +
          MAX_FILTERS +
          ')'
      });
    } else {
      this.setState({
        autocompleteDisabled: false,
        autocompleteValue: ''
      });
    }
  }

  _reachedMaxFilters() {
    var totalFilters = 0;
    _.forEach(this.selectedFilters, filtersType => {
      if (filtersType.filters) {
        totalFilters += filtersType.filters.length;
      }
    });

    return totalFilters >= MAX_FILTERS;
  }

  handleSelectFilter = filter => {
    var selectedFilters = this.selectedFilters,
      filterGroup = this._getFilterGroup(filter.type),
      addSuccess;

    addSuccess = this.stocktake.addFilter(filter.type, filter.id);
    this.props.onFilterChange(this.stocktake);
    if (!filterGroup && addSuccess) {
      selectedFilters.push({
        type: filter.type,
        filters: [filter]
      });
    } else if (addSuccess) {
      filterGroup.filters.push(filter);
    }

    this.searchProducts();
    this.checkFilterLimit();
  };

  handleRemoveFilter = filter => {
    var stocktake = this.stocktake,
      selectedFilters = this.selectedFilters,
      filterGroup = this._getFilterGroup(filter.type);

    stocktake.removeFilter(filter.type, filter.id);
    this.props.onFilterChange(this.stocktake);
    if (filterGroup.filters.length > 1) {
      _.remove(filterGroup.filters, filter);
    } else {
      _.remove(selectedFilters, filterGroup);
    }

    this.searchProducts();
    this.checkFilterLimit();
  };

  _getFilterGroup(filterType) {
    return _.find(this.selectedFilters, { type: filterType });
  }

  searchProducts() {
    var selectedFilters = this.selectedFilters,
      selectedFiltersIds = {};

    _.forEach(selectedFilters, filterGroup => {
      selectedFiltersIds[filterGroup.type] = _.map(filterGroup.filters, 'id');
    });

    this.productsStore.getAll().then(allProducts => {
      var matchingProducts = [];

      _.forEach(allProducts, product => {
        if (
          !product.deletedAt &&
          this._productMatchFilters(product, selectedFiltersIds)
        ) {
          matchingProducts.push(product);
        }
      });

      this.props.onProductResultsUpdate(matchingProducts);
      this.setState({ productResults: matchingProducts });
    });
  }

  _productMatchFilters(product, filters) {
    const { includeInactive } = this.props;
    var brands = PRODUCTS_FILTERS.brands,
      tags = PRODUCTS_FILTERS.tags,
      products = PRODUCTS_FILTERS.products,
      types = PRODUCTS_FILTERS.productTypes,
      suppliers = PRODUCTS_FILTERS.suppliers,
      foundTag = -1;

    if (!includeInactive && !product.active) {
      return false;
    }

    if (
      filters[products.key] &&
      filters[products.key].indexOf(product.id) > -1
    ) {
      return true;
    }

    if (
      filters[brands.key] &&
      filters[brands.key].indexOf(product.brandId) < 0
    ) {
      return false;
    }

    if (
      filters[types.key] &&
      filters[types.key].indexOf(product.literalTypeId) < 0
    ) {
      return false;
    }

    if (
      filters[suppliers.key] &&
      filters[suppliers.key].indexOf(product.supplierId) < 0
    ) {
      return false;
    }

    if (filters[tags.key]) {
      console.log('filters', filters[tags.key], product);
      _.forEach(product.tagIds, tag => {
        if (foundTag < 0) {
          foundTag = filters[tags.key].indexOf(tag);
        }
      });

      if (foundTag < 0) {
        return false;
      }
    }

    return (
      filters[brands.key] ||
      filters[types.key] ||
      filters[tags.key] ||
      filters[suppliers.key]
    );
  }

  _removeInactiveProductFilters() {
    var productFilters = _.find(this.selectedFilters, {
      type: PRODUCTS_FILTERS.products.key
    });

    if (productFilters) {
      _.forEach(productFilters.filters, filter => {
        if (typeof filter !== 'object') {
          return;
        }

        if (!filter.active) {
          this.handleRemoveFilter(filter);
        }
      });
    }
  }

  render() {
    const {
      state,
      autocompleteDisabled,
      autocompleteValue,
      productResults
    } = this.state;
    return (
      <div>
        {state === STATES.ready && (
          <div>
            <RBField classes="vd-mtl">
              <RBLabel>Filter Products</RBLabel>
              <RBValue>
                <Autocomplete
                  disabled={autocompleteDisabled}
                  value={autocompleteValue}
                  collection={this.productFilters}
                  typeaheadEntities={typeaheadEntities}
                  includeInactive={this.props.includeInactive}
                  onSelectFilter={this.handleSelectFilter}
                />
              </RBValue>
            </RBField>
            <FilterTagGroups
              selectedFilters={this.selectedFilters}
              onRemoveFilter={this.handleRemoveFilter}
            />
            {!!this.selectedFilters.length && (
              <FilterProductResult productResults={productResults} />
            )}
          </div>
        )}
        {state === STATES.inProgress && (
          <div className="vd-section vd-align-center">
            <RBLoader />
            Loading filter search...
          </div>
        )}
        {state === STATES.ready &&
          !this.selectedFilters.length && (
            <div className="vd-section vd-align-center">
              <img
                src={STOCK_CONTROL_NEW_INVENTORY_COUNT_IMAGE}
                width="150"
                alt=""
              />
              <p className="vd=text==secondary vd-mtl">
                Use filters to include products in this count.
              </p>
            </div>
          )}
      </div>
    );
  }
}

export default FilterProductSearch;
