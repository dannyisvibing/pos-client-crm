import React from 'react';
import PurchaseOrderDetail from './PurchaseOrderDetail';
import StockReturnDetail from './StockReturnDetail';
import StockTransferDetail from './StockTransferDetail';

const Details = ({ type, ...props }) =>
  type === 'supplierOrder' ? (
    <PurchaseOrderDetail {...props} />
  ) : type === 'supplierReturn' ? (
    <StockReturnDetail {...props} />
  ) : type === 'outletTransfer' ? (
    <StockTransferDetail {...props} />
  ) : (
    <div />
  );

export default Details;
