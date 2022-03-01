import React from 'react';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTH,
  RBTD,
  RBTR
} from '../../../../rombostrap/components/RBTable/RBTable';
import { RBInput, RBButton, RBLoader } from '../../../../rombostrap';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';

const TargetProductsTable = ({
  type,
  target,
  items,
  saving,
  formatCurrency,
  onItemChange,
  onItemRemove,
  onFormElementStateChange
}) => (
  <RBTable compact>
    <RBTHead>
      <RBTR>
        <RBTH width="80">Order</RBTH>
        <RBTH width="300">Product</RBTH>
        <RBTH width="130">Stock on Hand</RBTH>
        {type === 'outletTransfer' && <RBTH width="130">Stock at Source</RBTH>}
        <RBTH width="130">Quantity</RBTH>
        {target === 'receive' && <RBTH width="130">Received</RBTH>}
        <RBTH width="130">Supply Price</RBTH>
        <RBTH width="130">Total</RBTH>
        {target === 'entire' && <RBTH width="50" />}
      </RBTR>
    </RBTHead>
    <RBTBody>
      {items.map((item, i) => (
        <RBTR key={i}>
          <RBTD>{i + 1}</RBTD>
          <RBTD>{item.name}</RBTD>
          <RBTD>{item.stockOnHand}</RBTD>
          {type === 'outletTransfer' && (
            <RBTD>{item.stockAtSource || '-'}</RBTD>
          )}
          <RBTD>
            {target === 'entire' && (
              <RBInput
                rbNumberEnabled
                rbNumberOptions={{ decimalPlaces: 0, stripNonNumeric: true }}
                value={item.quantity}
                onInputChange={quantity =>
                  onItemChange(i, 'quantity', quantity)
                }
                onStateChange={state =>
                  onFormElementStateChange(`${item.product_id}-quantity`, state)
                }
              />
            )}
            {target === 'receive' && item.quantity}
          </RBTD>
          {target === 'receive' && (
            <RBTD>
              <RBInput
                rbNumberEnabled
                rbNumberOptions={{ decimalPlaces: 0, stripNonNumeric: true }}
                value={item.receivedQuantity}
                onInputChange={quantity =>
                  onItemChange(i, 'receivedQuantity', quantity)
                }
                onStateChange={state =>
                  onFormElementStateChange(
                    `${item.product_id}-receivedQuantity`,
                    state
                  )
                }
              />
            </RBTD>
          )}
          <RBTD>
            <RBInput
              rbNumberEnabled
              rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
              value={item.supplyPrice}
              onInputChange={supplyPrice =>
                onItemChange(i, 'supplyPrice', supplyPrice)
              }
              onStateChange={state =>
                onFormElementStateChange(
                  `${item.product_id}-supplyPrice`,
                  state
                )
              }
            />
          </RBTD>
          {target !== 'receive' && (
            <RBTD>{formatCurrency(item.quantity * item.supplyPrice)}</RBTD>
          )}
          {target === 'receive' && (
            <RBTD>
              {formatCurrency(item.receivedQuantity * item.supplyPrice)}
            </RBTD>
          )}
          {target === 'entire' && (
            <RBTD>
              <RBButton
                modifiers={['icon', 'table']}
                category="negative"
                onClick={e => onItemRemove(e, i)}
              >
                <i className="fa fa-trash" />
              </RBButton>
            </RBTD>
          )}
        </RBTR>
      ))}
      {saving && (
        <RBTR>
          <RBTD
            colSpan={type === 'outletTransfer' ? 8 : 7}
            classes="vd-align-center"
          >
            <RBLoader />
          </RBTD>
        </RBTR>
      )}
    </RBTBody>
  </RBTable>
);

export default withCurrencyFormatter(TargetProductsTable);
