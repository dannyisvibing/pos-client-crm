import React from 'react';
import { Field } from 'formik';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTH,
  RBTD,
  RBTR
} from '../../../rombostrap/components/RBTable/RBTable';
import { RBInput, RBButton } from '../../../rombostrap';
import { logRender } from '../../../utils/debug';

const PricebookItemsTable = props => {
  logRender('render PricebookItemsTable');
  const {
    items,
    getProductById,
    onDeleteItem,
    onDiscountChange,
    onMarkupChange
  } = props;
  return (
    <RBTable compact>
      <RBTHead>
        <RBTR>
          <RBTH width="300">
            <div>item</div>
            <div>SKU</div>
          </RBTH>
          <RBTH width="80">
            <div>Supply</div>
            <div>Price</div>
          </RBTH>
          <RBTH width="80">
            <div>Markup</div>
            <div className="vd-text-supplementary">(%)</div>
          </RBTH>
          <RBTH width="85">
            <div>Discount</div>
            <div className="vd-text-supplementary">(%)</div>
          </RBTH>
          <RBTH width="120">
            <div>Retail Price</div>
            <div className="vd-text-supplementary">Excluding tax</div>
          </RBTH>
          <RBTH width="90">
            <div>Loyalty</div>
            <div>Earned</div>
          </RBTH>
          <RBTH width="120">
            <div>Min. Units</div>
            <div className="vd-text-supplementary">In Store only</div>
          </RBTH>
          <RBTH width="120">
            <div>Max. Units</div>
            <div className="vd-text-supplementary">In Store only</div>
          </RBTH>
          <RBTH classes="vd-tight" />
        </RBTR>
      </RBTHead>
      <RBTBody>
        {/* <RBTR>
            <RBTD colSpan='2'>
                <div className='vd-text-label'>Change all on page</div>
            </RBTD>
            <RBTD>
                <RBInput value={markupBatch}
                    onInputChange={value => onBatchInputChange('markupBatch', value)}/>
            </RBTD>
            <RBTD>
                <RBInput value={discountBatch}
                    onInputChange={value => onBatchInputChange('discountBatch', value)}/>
            </RBTD>
            <RBTD colSpan='5'></RBTD>
        </RBTR> */}
        {items.map((item, i) => (
          <RBTR key={i}>
            <RBTD>
              <div>{getProductById(item.productId).fullname}</div>
              <div>{getProductById(item.productId).sku}</div>
            </RBTD>
            <RBTD>{getProductById(item.productId).supplyPrice}</RBTD>
            <RBTD>
              <Field
                name={`items.${i}.markup`}
                render={props => (
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={props.field.value}
                    onInputChange={markup =>
                      onMarkupChange(item, i, markup, props.form.setFieldValue)
                    }
                    onBlur={() =>
                      props.form.setFieldTouched(`items.${i}.markup`, true)
                    }
                  />
                )}
              />
            </RBTD>
            <RBTD>
              <Field
                name={`items.${i}.discount`}
                render={props => (
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={props.field.value}
                    onInputChange={discount =>
                      onDiscountChange(
                        item,
                        i,
                        discount,
                        props.form.setFieldValue
                      )
                    }
                    onBlur={() =>
                      props.form.setFieldTouched(`items.${i}.discount`, true)
                    }
                  />
                )}
              />
            </RBTD>
            <RBTD>
              <Field
                name={`items.${i}.retailPrice`}
                render={props => (
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={props.field.value}
                    onInputChange={retailPrice =>
                      props.form.setFieldValue(
                        `items.${i}.retailPrice`,
                        retailPrice
                      )
                    }
                    onBlur={() =>
                      props.form.setFieldTouched(`items.${i}.retailPrice`, true)
                    }
                  />
                )}
              />
            </RBTD>
            <RBTD>
              <Field
                name={`items.${i}.loyaltyEarned`}
                render={props => (
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={props.field.value}
                    onInputChange={loyaltyEarned =>
                      props.form.setFieldValue(
                        `items.${i}.loyaltyEarned`,
                        loyaltyEarned
                      )
                    }
                    onBlur={() =>
                      props.form.setFieldTouched(
                        `items.${i}.loyaltyEarned`,
                        true
                      )
                    }
                  />
                )}
              />
            </RBTD>
            <RBTD>
              <Field
                name={`items.${i}.minUnits`}
                render={props => (
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={props.field.value}
                    onInputChange={minUnits =>
                      props.form.setFieldValue(`items.${i}.minUnits`, minUnits)
                    }
                    onBlur={() =>
                      props.form.setFieldTouched(`items.${i}.minUnits`, true)
                    }
                  />
                )}
              />
            </RBTD>
            <RBTD>
              <Field
                name={`items.${i}.maxUnits`}
                render={props => (
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={props.field.value}
                    onInputChange={maxUnits =>
                      props.form.setFieldValue(`items.${i}.maxUnits`, maxUnits)
                    }
                    onBlur={() =>
                      props.form.setFieldTouched(`items.${i}.maxUnits`, true)
                    }
                  />
                )}
              />
            </RBTD>
            <RBTD classes="vd-tight">
              <RBButton
                modifiers={['icon', 'table']}
                category="negative"
                onClick={e => onDeleteItem(e)}
              >
                <i className="fa fa-trash" />
              </RBButton>
            </RBTD>
          </RBTR>
        ))}
      </RBTBody>
    </RBTable>
  );
};

export default PricebookItemsTable;
