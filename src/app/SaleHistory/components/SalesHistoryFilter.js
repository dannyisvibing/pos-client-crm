import React from 'react';
import _ from 'lodash';
import { RBSelect, RBInput, RBField, RBButton } from '../../../rombostrap';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import { SALE_STATUS } from '../../../modules/sale/sale.constants';
import '../styles/SalesHistory.css';

function getStatusNullLabel(statusCategory) {
  if (statusCategory === 'continue_sales') return 'All Open Sales';
  if (statusCategory === 'process_returns') return 'All Closed Sales';
  return 'All Sales';
}

const SalesHistoryFilter = props => {
  const {
    outlets,
    users,
    statusCategory,
    values,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleSubmit
  } = props;
  const status =
    statusCategory !== 'all_sales'
      ? _.filter(SALE_STATUS, { category: statusCategory })
      : SALE_STATUS;
  return (
    <form onSubmit={handleSubmit}>
      <div className="wr-sales-history-searchfilters">
        <div className="wr-sales-history-searchfilters-container">
          <div className="wr-sales-history-searchfilters-item">
            <RBField classes="wr-sales-history-search-item">
              <RBLabel>Status</RBLabel>
              <RBValue>
                <RBSelect
                  nullLabel={getStatusNullLabel(statusCategory)}
                  selectedEntity={values.status}
                  entities={status}
                  onChange={option => setFieldValue('status', option.entity)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Customer</RBLabel>
              <RBValue>
                <RBInput
                  value={values.customerName}
                  onInputChange={name => setFieldValue('customerName', name)}
                  onBlur={() => setFieldTouched('customerName', true)}
                  placeholder="Search for customers"
                />
              </RBValue>
            </RBField>
            <RBField classes="wr-sales-history-search-item">
              <RBLabel>Receipt</RBLabel>
              <RBValue>
                <RBInput
                  value={values.receiptNumber}
                  onInputChange={number =>
                    setFieldValue('receiptNumber', number)
                  }
                  onBlur={() => setFieldTouched('receiptNumber', true)}
                  placeholder="Search by receipt number"
                />
              </RBValue>
            </RBField>
          </div>
          <div className="wr-sales-history-searchfilters-item">
            <RBField classes="wr-sales-history-search-item">
              <RBLabel>Outlet</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.outletId}
                  nullLabel="All"
                  entities={outlets}
                  entityKey="outletName"
                  entityValue="outletId"
                  onChange={option =>
                    setFieldValue('outletId', option.outletId)
                  }
                />
              </RBValue>
            </RBField>
            <RBField classes="wr-sales-history-search-item">
              <RBLabel>User</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.userId}
                  nullLabel="All"
                  entities={users}
                  entityKey="displayName"
                  entityValue="userId"
                  onChange={option => setFieldValue('userId', option.userId)}
                />
              </RBValue>
            </RBField>
            {/* <RBField>
              <RBLabel>Date</RBLabel>
              <RBValue>
              </RBValue>
            </RBField> */}
          </div>
        </div>
        <div className="wr-sales-history-actions-container">
          <RBButton category="primary" disabled={isSubmitting}>
            Search
          </RBButton>
        </div>
      </div>
    </form>
  );
};

export default SalesHistoryFilter;
