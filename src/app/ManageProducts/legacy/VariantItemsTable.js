import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { RBInput, RBForm } from '../../../rombostrap';
import { Button } from '../../common/legacy/Basic';
import Tabs from './Tabs';
import ProductVariantInventoryTable from './VariantInventoryTable';
import ProductTaxTableByOutlet from './TaxTable';

class VariantItemsTable extends Component {
  state = {
    formState: {}
  };

  handleExpand = (e, index) => {
    this.setState({ [index]: !this.state[index] });
  };

  handleSwitchTab = tab => {
    this.setState({ selectedTab: tab });
  };

  handleFormElementStateChange = (name, state) => {
    if (!this.formRef) {
      setTimeout(() => {
        this.handleFormElementStateChange(name, state);
      }, 0);
    } else {
      this.formRef.onStateChanged(name, state);
    }
  };

  handleFormStateChange = formState => {
    this.props.onFormElementStateChange({
      dirty: formState.dirty,
      pristine: formState.pristine,
      valid: formState.valid,
      invalid: formState.invalid
    });
    this.setState({ formState });
  };

  render() {
    const {
      classes,
      variantItems,
      taxOptions,
      trackingEnabled,
      onVariantItemRemove,
      onVariantItemChange,
      onVariantItemTrackingChange,
      onVariantItemTaxChange
    } = this.props;
    const { selectedTab } = this.state;
    return (
      <RBForm
        ref={c => (this.formRef = c)}
        className={classes}
        onFormStateChanged={this.handleFormStateChange}
      >
        <table className="vd-table vd-table--compact">
          <thead>
            <tr>
              <th width="300">Variant Name</th>
              {/* <th width='160'>SKU</th> */}
              <th>Supplier Code</th>
              <th>Supplier Price</th>
              <th className="vd-align-right">
                Markup
                <div>(%)</div>
              </th>
              <th className="vd-tight">
                Retail Price
                <div>
                  <i className="vd-text--sub">(Excluding tax)</i>
                </div>
              </th>
              <th />
            </tr>
          </thead>
          {variantItems.map((variantItem, i) => (
            <tbody key={i}>
              <tr
                className={classnames(
                  'vd-expandable vd-expandable--nt vd-sml-pad-v vd-no-border-b',
                  {
                    'vd-expandable--expanded': this.state[i]
                  }
                )}
              >
                <td
                  className="vd-align-left"
                  onClick={e => this.handleExpand(e, i)}
                >
                  <a>
                    <Button
                      unnested
                      primary
                      table
                      faIcon={
                        this.state[i]
                          ? 'fa fa-chevron-up'
                          : 'fa fa-chevron-down'
                      }
                    />
                    {variantItem.values.map((value, j) => (
                      <span key={j} className="vd-mlm">
                        {j !== variantItem.values.length - 1
                          ? `${value} /`
                          : value}
                      </span>
                    ))}
                  </a>
                </td>
                {/* <td className='vd-no-pad-l'>
                      <Input
                          value={variantItem.sku}
                          onChange={e => onVariantItemChange(e.target.value, i, 'sku')}/>
                  </td> */}
                <td className="vd-no-pad-l">
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 0,
                      stripNonNumeric: true
                    }}
                    value={variantItem.supplierCode}
                    onInputChange={value =>
                      onVariantItemChange(value, i, 'supplierCode')
                    }
                    onStateChange={state =>
                      this.handleFormElementStateChange(
                        `${i}-supplierCode`,
                        state
                      )
                    }
                  />
                </td>
                <td className="vd-no-pad-l">
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={variantItem.supplyPrice}
                    onInputChange={value =>
                      onVariantItemChange(value, i, 'supplyPrice')
                    }
                    onStateChange={state =>
                      this.handleFormElementStateChange(
                        `${i}-supplyPrice`,
                        state
                      )
                    }
                  />
                </td>
                <td className="vd-no-pad-l">
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={variantItem.markup}
                    onInputChange={value =>
                      onVariantItemChange(value, i, 'markup')
                    }
                    onStateChange={state =>
                      this.handleFormElementStateChange(`${i}-markup`, state)
                    }
                  />
                </td>
                <td className="vd-no-pad-l">
                  <RBInput
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    value={variantItem.retailPrice}
                    onInputChange={value =>
                      onVariantItemChange(value, i, 'retailPrice')
                    }
                    onStateChange={state =>
                      this.handleFormElementStateChange(
                        `${i}-retailPrice`,
                        state
                      )
                    }
                  />
                </td>
                <td className="vd-no-pad-l vd-align-center">
                  <Button
                    unnested
                    table
                    negative
                    faIcon="fa fa-trash"
                    onClick={e => onVariantItemRemove(i)}
                  />
                </td>
              </tr>
              <tr>
                <td />
                <td colSpan="5">
                  {trackingEnabled && (
                    <Tabs
                      tabs={[
                        {
                          id: 'inventory',
                          label: 'Inventory'
                        },
                        {
                          id: 'tax',
                          label: 'Tax'
                        }
                      ]}
                      classes="vd-mbl"
                      onChange={this.handleSwitchTab}
                    />
                  )}
                  {trackingEnabled &&
                    (!selectedTab || selectedTab.id === 'inventory') && (
                      <ProductVariantInventoryTable
                        inventoryTracking={variantItem.trackingInventory}
                        onChangeTrackingDetail={(outletId, key, value) =>
                          onVariantItemTrackingChange(i, outletId, key, value)
                        }
                        onFormElementStateChange={(name, state) =>
                          this.handleFormElementStateChange(
                            `${i}-${name}`,
                            state
                          )
                        }
                      />
                    )}
                  {(!trackingEnabled ||
                    (selectedTab && selectedTab.id === 'tax')) && (
                    <ProductTaxTableByOutlet
                      retailPrice={variantItem.retailPrice}
                      taxOptions={taxOptions}
                      data={variantItem.taxByOutlet}
                      onChangeTax={(outletId, tax) =>
                        onVariantItemTaxChange(i, outletId, tax)
                      }
                    />
                  )}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </RBForm>
    );
  }
}

VariantItemsTable.propTypes = {
  classes: PropTypes.string
};

VariantItemsTable.defaultProps = {
  classes: ''
};

export default VariantItemsTable;
