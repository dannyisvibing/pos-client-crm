import React from 'react';
import {
  RBSection,
  RBFlex,
  RBInput,
  RBSelect,
  RBLink,
  RBButton
} from '../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import SimpleDatePicker from '../../common/components/SimpleDatePicker';
import Filters from './constants/filter';

const Filter = ({
  filter,
  name,
  outlet_id,
  moreFilter,
  dateFrom,
  dateTo,
  dueDateFrom,
  dueDateTo,
  supplierId,
  outlets,
  suppliers,
  onFilterUpdate,
  onFilterChange,
  onLessMoreFilters
}) => (
  <form>
    <RBSection type="tertiary" classes="vd-ptxl">
      <RBFlex flex>
        <RBField classes="vd-mrl vd-col-4">
          <RBLabel>Show</RBLabel>
          <RBValue>
            <RBSelect
              selectedEntity={filter}
              nullLabel="All orders"
              entities={Filters}
              onChange={filter => onFilterChange('filter', filter.entity)}
            />
          </RBValue>
        </RBField>
        <RBField classes="vd-mrl vd-col-4">
          <RBLabel>Name/Number/Product/Supplier Invoice</RBLabel>
          <RBValue>
            <RBInput
              value={name}
              onInputChange={name => onFilterChange('name', name)}
            />
          </RBValue>
        </RBField>
        <RBField classes="vd-col-4">
          <RBLabel>Outlet</RBLabel>
          <RBValue>
            <RBSelect
              selectedEntity={outlet_id}
              nullLabel=""
              entities={outlets}
              entityKey="outletName"
              entityValue="outletId"
              onChange={outlet => onFilterChange('outlet_id', outlet.outletId)}
            />
          </RBValue>
        </RBField>
      </RBFlex>
      <div>
        {moreFilter && (
          <RBFlex flex>
            <RBField classes="vd-mrl vd-col-4">
              <RBLabel>Date from</RBLabel>
              <RBValue>
                <SimpleDatePicker
                  date={dateFrom}
                  onSelectDay={day => onFilterChange('dateFrom', day)}
                />
              </RBValue>
            </RBField>
            <RBField classes="vd-mrl vd-col-4">
              <RBLabel>Date to</RBLabel>
              <RBValue>
                <SimpleDatePicker
                  date={dateTo}
                  onSelectDay={day => onFilterChange('dateTo', day)}
                />
              </RBValue>
            </RBField>
            <RBField classes="vd-mrl vd-col-4">
              <RBLabel>Due date from</RBLabel>
              <RBValue>
                <SimpleDatePicker
                  date={dueDateFrom}
                  onSelectDay={day => onFilterChange('dueDateFrom', day)}
                />
              </RBValue>
            </RBField>
            <RBField classes="vd-col-4">
              <RBLabel>Due date to</RBLabel>
              <RBValue>
                <SimpleDatePicker
                  date={dueDateTo}
                  onSelectDay={day => onFilterChange('dueDateTo', day)}
                />
              </RBValue>
            </RBField>
          </RBFlex>
        )}
        {moreFilter && (
          <RBFlex flex>
            <RBField classes="vd-col-4 vd-mrm vd-mbm">
              <RBLabel>Supplier</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={supplierId}
                  nullLabel=""
                  entityValue="id"
                  entities={suppliers}
                  onChange={supplier =>
                    onFilterChange('supplierId', supplier.id)
                  }
                />
              </RBValue>
            </RBField>
            <RBField classes="vd-col-8" />
          </RBFlex>
        )}
        <RBFlex flex flexJustify="between" flexAlign="center">
          <div>
            <RBLink classes="vd-mrl" onClick={onLessMoreFilters}>
              {moreFilter ? 'Less' : 'More'} Filter Options
            </RBLink>
          </div>
          <RBButton category="secondary" onClick={onFilterUpdate}>
            Update
          </RBButton>
        </RBFlex>
      </div>
    </RBSection>
  </form>
);

export default Filter;
