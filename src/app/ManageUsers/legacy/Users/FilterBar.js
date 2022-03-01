import React from 'react';
import {
  RBSection,
  RBFlex,
  RBField,
  RBInput,
  RBSelect,
  RBButton
} from '../../../../rombostrap';
import { RBLabel, RBValue } from '../../../../rombostrap/components/RBField';

const FilterBar = ({
  query,
  role,
  roleOptions,
  outlet,
  outletOptions,
  onFilterChange,
  onApplyFilter
}) => (
  <RBSection type="tertiary">
    <form>
      <RBFlex
        flex
        flexAlign="end"
        classes="vd-g-row vd-g-s-up-1 vd-g-m-up-2 vd-g-l-up-4"
      >
        <div className="vd-g-col">
          <RBField classes="vd-mrl vd-mbn">
            <RBLabel>Name</RBLabel>
            <RBValue>
              <RBInput
                value={query}
                onInputChange={query => onFilterChange('query', query)}
                placeholder="Search by username or name"
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-col">
          <RBField classes="vd-mrl vd-mbn">
            <RBLabel>Role</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={role}
                entities={roleOptions}
                nullLabel="All Roles"
                onChange={role => onFilterChange('role', role)}
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-col">
          <RBField classes="vd-mrl vd-mbn">
            <RBLabel>Outlet</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={outlet}
                entities={outletOptions}
                nullLabel="All Outlet"
                onChange={outlet => onFilterChange('outlet', outlet)}
              />
            </RBValue>
          </RBField>
        </div>
        <RBFlex flex flexJustify="between" classes="vd-g-col">
          <div />
          <RBButton category="secondary" onClick={onApplyFilter}>
            Search
          </RBButton>
        </RBFlex>
      </RBFlex>
    </form>
  </RBSection>
);

export default FilterBar;
