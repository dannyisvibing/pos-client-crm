import React from 'react';
import moment from 'moment';
import withCurrencyFormatter from '../../common/containers/WithCurrencyFormatter';
import {
  getPaymentMethodName,
  getLineItemDisplayPrice
} from '../../../modules/sale';
import { LineItemTotalPrice } from '../../Sale/components/ReceiptBuilder';

const ReceiptSummary = ({ receipt, formatCurrency }) => {
  return (
    <ul className="vd-col-6">
      <li className="wr-expanded-sale-summary-section">
        <div className="wr-expanded-sale-totals-line">
          <div>Subtotal</div>
          <div>{formatCurrency(receipt.subtotal)}</div>
        </div>
        {receipt.totalDiscount > 0 && (
          <div className="wr-expanded-sale-totals-line">
            <div>Discount</div>
            <div>{formatCurrency(receipt.totalDiscount)}</div>
          </div>
        )}
        <div className="wr-expanded-sale-totals-line">
          <div>
            {receipt.taxBreakdown.length === 0 ||
            (receipt.taxBreakdown.length === 1 &&
              receipt.taxBreakdown[0].taxAmount === 0)
              ? 'Tax (No Tax)'
              : receipt.taxBreakdown.length > 1
                ? `Tax (${receipt.taxBreakdown.length} taxes)`
                : `Tax (${receipt.taxBreakdown[0].name})`}
          </div>
          <div>{formatCurrency(receipt.totalTax)}</div>
        </div>
        {receipt.taxBreakdown.length >= 2 && (
          <ul className="wr-expanded-sale-totals-tax-breakdown-section">
            {receipt.taxBreakdown.map((tax, i) => (
              <li key={i} className="wr-expanded-sale-totals-tax-item">
                <span>{`${tax.name}(${tax.rate}%)`}</span>
                <span>{` - ${formatCurrency(tax.taxAmount)}`}</span>
              </li>
            ))}
          </ul>
        )}
      </li>
      <li className="wr-expanded-sale-summary-section wr-expanded-sale-totals-line">
        <div className="wr-expanded-sale-total-label wr-expanded-sale-label--bold">
          total
        </div>
        <div className="wr-expanded-sale-label--bold">
          {formatCurrency(receipt.totalPrice)}
        </div>
      </li>
      {receipt.payments.length > 0 && (
        <li className="wr-expanded-sale-summary-section">
          <ul>
            {receipt.payments.map((payment, i) => (
              <li key={i} className="wr-expanded-sale-totals-line">
                <div className="vd-col-3">
                  {getPaymentMethodName(payment.methodId)}
                </div>
                <div className="vd-col-5">
                  {moment(payment.paidDate).format('ddd, D MMM YY H:ma')}
                </div>
                <div className="vd-col-4 wr-expanded-sale-payment-amount">
                  {formatCurrency(payment.amount)}
                </div>
              </li>
            ))}
          </ul>
        </li>
      )}
      <li className="wr-expanded-sale-summary-section wr-expanded-sale-totals-line">
        <div className="wr-expanded-sale-label--bold">Balance</div>
        <div className="wr-expanded-sale-label--bold">
          {formatCurrency(receipt.balance)}
        </div>
      </li>
    </ul>
  );
};

const LineItems = ({ lineItems, formatCurrency }) => {
  return (
    <ul className="wr-expanded-sale-summary-section">
      {lineItems.map(
        (
          {
            name,
            quantity,
            basePrice,
            taxInfo,
            discountRate,
            markup,
            supplyPrice,
            note
          },
          i
        ) => (
          <li key={i} className="wr-expanded-sale-line-item">
            <div className="wr-expanded-sale-line-item-row">
              <div className="vd-col-6 wr-expanded-sale-line-item-description">
                <div className="wr-expanded-sale-line-item-quantity">
                  {quantity}
                </div>
                <div className="wr-expanded-sale-line-item-name">{name}</div>
              </div>
              <div className="vd-col-4 wr-expanded-sale-line-item-unit-price-details">
                <div className="wr-expanded-sale-line-item-unit-price">
                  {getLineItemDisplayPrice({
                    quantity,
                    supplyPrice,
                    discountRate,
                    markup
                  })}
                </div>
                <div>
                  <span>+</span>
                  <span>{formatCurrency(taxInfo ? taxInfo.taxAmount : 0)}</span>
                  <span>{` Tax (${
                    taxInfo ? taxInfo.taxName : 'No Tax'
                  })`}</span>
                </div>
              </div>
              <div className="vd-col-2 wr-expanded-sale-line-item-total">
                <LineItemTotalPrice
                  totalPrice={getLineItemDisplayPrice({
                    quantity,
                    supplyPrice,
                    discountRate,
                    markup
                  })}
                />
              </div>
            </div>
            {discountRate > 0 && (
              <div className="wr-expanded-sale-line-item-row wr-expanded-sale-line-item-row--indented vd-text-supplementary">
                <div>
                  Was: {formatCurrency(basePrice)} Disc: {discountRate}% /{' '}
                  {formatCurrency(basePrice * discountRate / 100)}
                </div>
              </div>
            )}
            {note && (
              <div className="wr-expanded-sale-line-item-row wr-expanded-sale-line-item-row--indented vd-text-supplementary">
                <span className="wr-honour-line-breaks">Note: {note}</span>
              </div>
            )}
          </li>
        )
      )}
    </ul>
  );
};

const ReceiptDetailPanel = props => {
  const { receipt, ...otherProps } = props;
  return (
    <div className="vd-col-10 wr-expanded-sale-details">
      <LineItems lineItems={receipt.lineItems} {...otherProps} />
      <div className="wr-expanded-sale-summary">
        <div className="vd-col-6 wr-expanded-sale-note">
          <div className="wr-expanded-sale-label--bold">Note</div>
          <div className="wr-expanded-sale-note-content">
            <span className="wr-honour-line-breaks">{receipt.note}</span>
          </div>
        </div>
        <ReceiptSummary receipt={receipt} {...otherProps} />
      </div>
    </div>
  );
};

export default withCurrencyFormatter(ReceiptDetailPanel);
