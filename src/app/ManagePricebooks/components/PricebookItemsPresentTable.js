import React from 'react';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTH,
  RBTD,
  RBTR
} from '../../../rombostrap/components/RBTable/RBTable';
import { logRender } from '../../../utils/debug';

const PricebookItemsPresentTableContainer = ({
  pricebookItems,
  getProductById
}) => {
  logRender('render PricebookItemsPresentTable');
  return (
    <RBTable>
      <RBTHead>
        <RBTR>
          <RBTH>Product</RBTH>
          <RBTH>Retail Price (Excl)</RBTH>
          <RBTH>Loyalty Earned</RBTH>
          <RBTH>Min Units</RBTH>
          <RBTH>Max Units</RBTH>
        </RBTR>
      </RBTHead>
      <RBTBody>
        {pricebookItems.map((item, i) => (
          <RBTR key={i}>
            <RBTD width="350">{getProductById(item.productId).fullname}</RBTD>
            <RBTD>${item.retailPrice}</RBTD>
            <RBTD>${item.loyaltyEarned}</RBTD>
            <RBTD>{item.minUnits}</RBTD>
            <RBTD>{item.maxUnits}</RBTD>
          </RBTR>
        ))}
      </RBTBody>
    </RBTable>
  );
};

export default PricebookItemsPresentTableContainer;
