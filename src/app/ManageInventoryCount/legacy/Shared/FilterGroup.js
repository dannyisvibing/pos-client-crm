import React, { Component } from 'react';
import _ from 'lodash';
import STATES from '../../../../constants/states';
import PRODUCT_FILTERS from '../../../../constants/stocktake/product-filters';
import { RBLozenge } from '../../../../rombostrap';
import productFiltersManager from '../../../../modules/idb/managers/product-filters-manager';

class FilterGroup extends Component {
  state = {
    stocktakeFiltersState: STATES.inProgress,
    filterTitle: '',
    filters: []
  };

  componentWillMount() {
    const { filterGroup } = this.props;
    var filterType = filterGroup.type,
      filters = filterGroup.filters;

    var filterTitle = _.find(PRODUCT_FILTERS, { key: filterType }).name;

    productFiltersManager
      .getFilterByIds(filterType, filters)
      .then(objectFilters => {
        this.setState({
          stocktakeFiltersState: STATES.ready,
          filters: objectFilters,
          filterTitle
        });
      });
  }

  render() {
    const { stocktakeFiltersState, filterTitle, filters } = this.state;
    return (
      <span>
        {stocktakeFiltersState === STATES.ready &&
          filters.map((filter, i) => (
            <span key={i}>
              <RBLozenge label={filterTitle}>{filter.name}</RBLozenge>
            </span>
          ))}
      </span>
    );
  }
}

export default FilterGroup;
