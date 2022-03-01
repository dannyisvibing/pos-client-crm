import React from 'react';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTH,
  RBTD,
  RBTR
} from '../../../../rombostrap/components/RBTable/RBTable';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';

const TargetProductsTable = ({ type, status, items = [], formatCurrency }) => (
  <RBTable compact>
    <RBTHead>
      <RBTR>
        <RBTH>Order</RBTH>
        <RBTH>Product</RBTH>
        <RBTH>SKU</RBTH>
        <RBTH>Supplier Code</RBTH>
        <RBTH>Stock</RBTH>
        {type === 'outletTransfer' && <RBTH>Stock at Source</RBTH>}
        {type !== 'supplierReturn' && <RBTH>Ordered</RBTH>}
        {type !== 'supplierReturn' && <RBTH>Received</RBTH>}
        {type === 'supplierReturn' && <RBTH>Returned</RBTH>}
        <RBTH>Supply Cost</RBTH>
        <RBTH>Total Supply Cost</RBTH>
        <RBTH>Retail Price</RBTH>
        <RBTH>Total Retail Price</RBTH>
      </RBTR>
    </RBTHead>
    <RBTBody>
      {items.map((item, i) => (
        <RBTR key={i}>
          <RBTD>{i + 1}</RBTD>
          <RBTD>{item.name}</RBTD>
          <RBTD>{item.sku}</RBTD>
          <RBTD>{item.supplierCode || '-'}</RBTD>
          <RBTD>{item.stockOnHand || 0}</RBTD>
          {type === 'outletTransfer' && <RBTH>{item.stockAtSource || 0}</RBTH>}
          {type !== 'supplierReturn' && <RBTD>{item.quantity || 0}</RBTD>}
          {type !== 'supplierReturn' && (
            <RBTD>{item.receivedQuantity || 0}</RBTD>
          )}
          {type === 'supplierReturn' && <RBTD>{item.quantity || 0}</RBTD>}
          <RBTD>{formatCurrency(item.supplyPrice)}</RBTD>
          {status !== 'received' && (
            <RBTD>{formatCurrency(item.quantity * item.supplyPrice)}</RBTD>
          )}
          {status === 'received' && (
            <RBTD>
              {formatCurrency(item.receivedQuantity * item.supplyPrice)}
            </RBTD>
          )}
          <RBTD>{formatCurrency(item.retailPrice)}</RBTD>
          {status !== 'received' && (
            <RBTD>{formatCurrency(item.quantity * item.retailPrice)}</RBTD>
          )}
          {status === 'received' && (
            <RBTD>
              {formatCurrency(item.receivedQuantity * item.retailPrice)}
            </RBTD>
          )}
        </RBTR>
      ))}
    </RBTBody>
  </RBTable>
);

export default withCurrencyFormatter(TargetProductsTable);
