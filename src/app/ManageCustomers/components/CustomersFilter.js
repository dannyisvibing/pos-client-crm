import React from 'react';
import PropTypes from 'prop-types';
import {
  RBSection,
  RBInput,
  RBSelect,
  RBFlex,
  RBButton
} from '../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import SimpleDatePicker from '../../common/components/SimpleDatePicker';
import { logRender } from '../../../utils/debug';
import CountryCodes from '../../../constants/countryCodes';

const CustomersFilter = ({
  filter,
  customerGroups,
  setFilter,
  applyFilter
}) => {
  logRender('render CustomersFilter');
  return (
    <RBSection type="tertiary" classes="vd-ptxl">
      <div className="vd-g-row">
        <div className="vd-g-col vd-g-s-9">
          <div className="vd-g-row">
            <RBField classes="vd-g-col vd-g-s-8 vd-mrm">
              <RBLabel>
                Search customers by name, customer code, or contact details
              </RBLabel>
              <RBValue>
                <RBInput
                  placeholder="Enter customer name, customer code, or contact details"
                  rbInputSymbol={{ align: 'left', icon: 'fa fa-search' }}
                  value={filter.name}
                  onInputChange={name => setFilter({ name })}
                />
              </RBValue>
            </RBField>
            <RBField classes="vd-g-col vd-g-s-4 vd-prm">
              <RBLabel>Customer Group</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={filter.customerGroupId}
                  nullLabel=""
                  entityValue="id"
                  entities={customerGroups}
                  onChange={customerGroup =>
                    setFilter({ customerGroupId: customerGroup.id })
                  }
                />
              </RBValue>
            </RBField>
          </div>
          <div className="vd-g-row">
            <RBField classes="vd-g-col vd-g-s-4 vd-mrm">
              <RBLabel>City</RBLabel>
              <RBValue>
                <RBInput
                  value={filter.city}
                  onInputChange={city => setFilter({ city })}
                />
              </RBValue>
            </RBField>
            <RBField classes="vd-g-col vd-g-s-4 vd-mrm">
              <RBLabel>Country</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={filter.countryCode}
                  nullLabel="All"
                  entities={CountryCodes}
                  entityKey="name"
                  entityValue="code"
                  onChange={country => setFilter({ countryCode: country.code })}
                />
              </RBValue>
            </RBField>
            <RBField classes="vd-g-col vd-g-s-4 vd-mrm">
              <RBLabel>Date Created</RBLabel>
              <RBValue>
                <SimpleDatePicker
                  date={filter.createdAt}
                  onSelectDay={createdAt => setFilter({ createdAt })}
                />
              </RBValue>
            </RBField>
          </div>
        </div>
        <RBFlex flex flexAlign="end" classes="vd-g-col vd-g-s-3 text-right">
          <RBField>
            <RBLabel />
            <RBValue>
              <RBButton category="secondary" onClick={() => applyFilter()}>
                Search
              </RBButton>
            </RBValue>
          </RBField>
        </RBFlex>
      </div>
    </RBSection>
  );
};

const { object, array, func } = PropTypes;
CustomersFilter.propTypes = {
  filter: object,
  customerGroups: array,
  setFilter: func.isRequired,
  applyFilter: func.isRequired
};

export default CustomersFilter;
