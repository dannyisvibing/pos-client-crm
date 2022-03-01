import React from 'react';
import StocktakeFilterGroup from './FilterGroup';

const Filters = ({ stocktake }) => (
  <div>
    {stocktake
      .getFilters()
      .map((filterGroup, i) => (
        <StocktakeFilterGroup key={i} filterGroup={filterGroup} />
      ))}
  </div>
);

export default Filters;
