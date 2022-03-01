import React from 'react';
import {
  RBHeader,
  RBSegControl,
  RBFlex,
  RBInput,
  RBButton
} from '../../../rombostrap';

const Discount = ({
  type,
  amount,
  currencySymbol,
  onRemove,
  onTypeChange,
  onAmountChange
}) => {
  return (
    <div>
      <RBHeader category="section">Apply discount to sale</RBHeader>
      <hr className="vd-hr" />
      <div className="vd-flex">
        <RBSegControl
          label="%"
          value="percent"
          checked={type === 'percent'}
          onChange={() => onTypeChange('percent')}
        />
        <RBSegControl
          label={currencySymbol}
          value="dollar"
          checked={type === 'dollar'}
          onChange={() => onTypeChange('dollar')}
        />
      </div>
      <RBFlex flex flexAlign="end">
        <RBInput
          value={amount}
          textAlign="right"
          rbNumberEnabled
          rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
          classes="vd-mbn"
          onInputChange={onAmountChange}
        />
        <RBButton modifiers={['icon']} category="negative" onClick={onRemove}>
          <i className="fa fa-trash vd-mrs" />
        </RBButton>
      </RBFlex>
    </div>
  );
};

export default Discount;
