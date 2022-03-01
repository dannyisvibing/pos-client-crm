import React from 'react';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTH,
  RBTD,
  RBTR
} from '../../../rombostrap/components/RBTable/RBTable';

const HistoryTable = ({ data }) => (
  <RBTable compact>
    <RBTHead>
      <RBTR>
        <RBTH>Date</RBTH>
        <RBTH>Variant</RBTH>
        <RBTH>User</RBTH>
        <RBTH>Outlet</RBTH>
        <RBTH width="85">Quantity</RBTH>
        <RBTH width="85">Outlet Quantity</RBTH>
        <RBTH width="85">Change</RBTH>
        <RBTH>Action</RBTH>
      </RBTR>
    </RBTHead>
    <RBTBody>
      {data.map((row, i) => (
        <RBTR key={i}>
          <RBTD>{row.date}</RBTD>
          <RBTD>{row.variant}</RBTD>
          <RBTD>{row.username}</RBTD>
          <RBTD>{row.outletName}</RBTD>
          <RBTD>{row.quantity}</RBTD>
          <RBTD>{row.outletQuantity}</RBTD>
          <RBTD>{row.change}</RBTD>
          <RBTD>{row.action}</RBTD>
        </RBTR>
      ))}
    </RBTBody>
  </RBTable>
);

export default HistoryTable;
