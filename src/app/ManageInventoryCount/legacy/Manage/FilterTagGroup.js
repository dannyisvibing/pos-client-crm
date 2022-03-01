import React from 'react';
import _ from 'lodash';
import PRODUCTS_FILTERS from '../../../../constants/stocktake/product-filters';
import FilterTagItem from './FilterTagItem';

function getFilterTitle(filterGroup) {
  var criteria = {
    key: filterGroup.type
  };

  return _.find(PRODUCTS_FILTERS, criteria).name;
}

const FilterTagGroup = ({ filterGroup, onRemoveFilter }) => (
  <span>
    {filterGroup.filters.map((filter, i) => (
      <FilterTagItem
        key={i}
        filterTitle={getFilterTitle(filterGroup)}
        filter={filter}
        onRemoveFilter={onRemoveFilter}
      />
    ))}
  </span>
);

export default FilterTagGroup;
