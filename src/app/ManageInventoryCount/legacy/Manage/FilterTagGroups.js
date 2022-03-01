import React from 'react';
import FilterTagGroup from './FilterTagGroup';

const FilterTagGroups = ({ selectedFilters, onRemoveFilter }) => (
  <div className="vd-mtm vd-mbl">
    {selectedFilters.map((filterGroup, i) => (
      <FilterTagGroup
        key={i}
        filterGroup={filterGroup}
        onRemoveFilter={onRemoveFilter}
      />
    ))}
  </div>
);

export default FilterTagGroups;
