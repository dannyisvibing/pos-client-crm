import React from 'react';
import CustomerBadge from '../../common/components/CustomerBadge';
import { Button } from '../../common/legacy/Basic';
import '../styles/SaleCustomer.css';

const SaleCustomer = ({
  name,
  group,
  customerCode,
  countryCode,
  confirmed,
  onShowDetail,
  onRemoveCustomer
}) => (
  <div className="pro-sale-customer" onClick={onShowDetail}>
    <a href="" className="wr-customer">
      <div className="wr-customer-icon">
        <span>
          <i className="fa fa-user" />
        </span>
      </div>
      <CustomerBadge
        classes="wr-customer-details"
        name={name}
        group={group}
        customerCode={customerCode}
        countryCode={countryCode}
        onClick={() => {}}
      />
      {!confirmed && (
        <Button faIcon="fa fa-trash" negative onClick={onRemoveCustomer} />
      )}
    </a>
  </div>
);

export default SaleCustomer;
