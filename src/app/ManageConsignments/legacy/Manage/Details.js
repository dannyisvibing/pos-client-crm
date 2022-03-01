import React from 'react';

import NewPurchaseOrderDetail from './NewPurchaseOrderDetail';
import NewStockReturnDetail from './NewStockReturnDetail';
import NewStockTransferDetail from './NewStockTransferDetail';
import PurchaseOrderDetail from './PurchaseOrderDetail';
import PurchaseOrderDetailUpdate from './PurchaseOrderDetailUpdate';
import StockReturnDetail from './StockReturnDetail';
import StockReturnDetailUpdate from './StockReturnDetailUpdate';
import StockTransferDetail from './StockTransferDetail';
import StockTransferDetailUpdate from './StockTransferDetailUpdate';

const Details = ({ create, type, target, ...props }) =>
  create && type === 'supplierOrder' ? (
    <NewPurchaseOrderDetail {...props} />
  ) : create && type === 'supplierReturn' ? (
    <NewStockReturnDetail {...props} />
  ) : create && type === 'outletTransfer' ? (
    <NewStockTransferDetail {...props} />
  ) : !create && target !== 'details' && type === 'supplierOrder' ? (
    <PurchaseOrderDetail {...props} />
  ) : !create && target !== 'details' && type === 'supplierReturn' ? (
    <StockReturnDetail {...props} />
  ) : !create && target !== 'details' && type === 'outletTransfer' ? (
    <StockTransferDetail {...props} />
  ) : !create && target === 'details' && type === 'supplierOrder' ? (
    <PurchaseOrderDetailUpdate {...props} />
  ) : !create && target === 'details' && type === 'supplierReturn' ? (
    <StockReturnDetailUpdate {...props} />
  ) : !create && target === 'details' && type === 'outletTransfer' ? (
    <StockTransferDetailUpdate {...props} />
  ) : (
    <div />
  );

export default Details;
