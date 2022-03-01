import React from 'react';
import { RBLozenge } from '../../../../rombostrap';

const FilterTagItem = ({ filterTitle, filter, onRemoveFilter }) => (
  <span>
    <RBLozenge label={filterTitle} onDelete={e => onRemoveFilter(filter)}>
      {filter.name}
    </RBLozenge>
  </span>
);

export default FilterTagItem;
