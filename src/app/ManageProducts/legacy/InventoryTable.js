import React from 'react';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTH,
  RBTD,
  RBTR
} from '../../../rombostrap/components/RBTable/RBTable';
import { RBButton } from '../../../rombostrap';

const InventoryTable = ({ inventoryInfo, onDelete }) => (
  <RBTable>
    <RBTHead>
      {inventoryInfo.type === 'single' ? (
        <RBTR>
          <RBTH>Outet</RBTH>
          <RBTH>In stock</RBTH>
          <RBTH />
        </RBTR>
      ) : (
        <RBTR>
          {inventoryInfo.data[0].variants.map((variant, i) => (
            <RBTH key={i}>{variant.name}</RBTH>
          ))}
          <RBTH>SKU</RBTH>
          <RBTH>Price</RBTH>
          <RBTH>In stock</RBTH>
          <RBTH />
        </RBTR>
      )}
    </RBTHead>
    <RBTBody>
      {inventoryInfo.data.map((row, i) => (
        <RBTR key={i}>
          {inventoryInfo.type === 'variants' &&
            row.variants.map((variant, i) => (
              <RBTD key={i}>{variant.value}</RBTD>
            ))}
          {inventoryInfo.type === 'variants' && <RBTD>{row.sku}</RBTD>}
          {inventoryInfo.type === 'variants' && <RBTD>${row.price}</RBTD>}
          {inventoryInfo.type === 'single' && <RBTD>{row.outletName}</RBTD>}
          <RBTD>{row.inStock}</RBTD>
          <RBTD classes="vd-align-right">
            <RBButton
              href={`/product/edit/${row.id}`}
              modifiers={['icon', 'table']}
              category="primary"
            >
              <i className="fa fa-pencil" />
            </RBButton>
            <RBButton
              modifiers={['icon', 'table']}
              category="primary"
              classes="vd-mll"
              onClick={e => onDelete(e, row.id)}
            >
              <i className="fa fa-trash" />
            </RBButton>
          </RBTD>
        </RBTR>
      ))}
    </RBTBody>
  </RBTable>
);

export default InventoryTable;
