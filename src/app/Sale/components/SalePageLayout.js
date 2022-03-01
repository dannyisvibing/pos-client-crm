import React from 'react';
import classnames from 'classnames';

export const Container = ({ children }) => (
  <div className="wr-current-sale-panel wr-current-sale-panel--summary">
    <div className="wr-transition-fade wr-full-height wr-current-sale-panel-content">
      {children}
    </div>
  </div>
);

export const SaleActions = ({ children }) => (
  <div className="sale-actions">{children}</div>
);

export const Sale = ({ children }) => <form className="sale">{children}</form>;

export const SaleHeader = ({ children }) => (
  <div className="sale-header">{children}</div>
);

export const SaleBody = ({ children }) => (
  <div className="sale-body">{children}</div>
);

export const SaleFooter = ({ children }) => (
  <div className="sale-footer">{children}</div>
);

export const SaleList = ({ children }) => (
  <ul className="sale-list">{children}</ul>
);

export const SaleListFooter = ({ children }) => (
  <div className="sale-list-footer">{children}</div>
);

export const SaleListItem = ({ children }) => (
  <li className="sale-list-item line-item--separator">{children}</li>
);

export const SaleSummary = ({ children }) => (
  <div className="sale-summary">{children}</div>
);

export const SaleSummaryHeader = ({ children }) => (
  <div className="sale-summary-header">{children}</div>
);

export const SaleSummarySection = ({
  classes,
  indent,
  saleItems,
  subtotals,
  total,
  payments,
  balance,
  note,
  children
}) => (
  <section
    className={classnames(
      'sale-summary-section',
      {
        'sale-summary-section--sale-items': saleItems,
        'sale-summary-section--indent': indent,
        'sale-summary-section--subtotals': subtotals,
        'sale-summary-section--total': total,
        'pro-summary-section-payments': payments,
        'sale-summary-section--balance': balance,
        'sale-summary-section--note': note
      },
      classes
    )}
  >
    {children}
  </section>
);

export const SaleSummaryList = ({ children }) => (
  <ul className="sale-summary-list">{children}</ul>
);

export const SaleSummaryLine = ({
  classes,
  subTotal,
  tax,
  taxBreakdown,
  total,
  discount,
  children
}) => (
  <div
    className={classnames(
      'sale-summary-line',
      {
        'sale-summary-line--sub-total': subTotal,
        'sale-summary-line--discount': discount,
        'sale-summary-line--tax': tax,
        'sale-summary-line--tax-breakdown': taxBreakdown,
        'sale-summary-line--total': total
      },
      classes
    )}
  >
    {children}
  </div>
);

export const SaleSummaryLineItem = ({ classes, label, value, children }) => (
  <div
    className={classnames(
      'sale-summary-line-item',
      {
        'sale-summary-line-item--label': label,
        'sale-summary-line-item--value': value
      },
      classes
    )}
  >
    {children}
  </div>
);

export const SaleTotals = ({ children }) => (
  <ul className="sale-totals">{children}</ul>
);

export const SaleTotalLine = ({
  subtotal,
  discount,
  disabled,
  totalTax,
  total,
  children
}) => (
  <li
    className={classnames('sale-total-line', {
      'pro-total-line-subtotal': subtotal,
      'pro-total-line-discount': discount,
      'pro-total-line-total-tax': totalTax,
      'sale-total-line-total': total,
      'sale-total-line--disabled': disabled
    })}
  >
    {children}
  </li>
);

export const SaleTotalLineItemValue = ({ children }) => (
  <div className="sale-total-line-item--value">{children}</div>
);

export const Cell = ({ expanded, readonly, children }) => (
  <ul
    className={classnames('li-cell', {
      'li-cell--expanded': expanded,
      'li-cell--readonly': readonly
    })}
  >
    {children}
  </ul>
);

export const CellSummaryContainer = ({ readonly, children, onClick }) => (
  <li
    className={classnames('li-cell-summary-container', {
      'li-cell-summary-container--readonly': readonly
    })}
    onClick={onClick}
  >
    {children}
  </li>
);

export const CellSummaryContainerNotes = ({ classes, children }) => (
  <li className={classnames('li-cell-summary-container-notes', classes)}>
    {children}
  </li>
);

export const CellSummary = ({
  classes,
  quantity,
  quantityNegative,
  nameContainer,
  name,
  totalsContainer,
  totals,
  totalPrice,
  totalBasePrice,
  unitPrice,
  confirmed,
  children
}) => (
  <div
    className={classnames(
      'li-cell-summary',
      {
        'li-cell-summary--quantity': quantity,
        'li-cell-summary--quantity-negative': quantityNegative,
        'li-cell-summary--name-container': nameContainer,
        'li-cell-summary--name': name,
        'li-cell-summary--totals-container': totalsContainer,
        'li-cell-summary--totals': totals,
        'li-cell-summary--total-price': totalPrice,
        'li-cell-summary--total-base-price': totalBasePrice,
        'li-cell-summary--unit-price': unitPrice,
        'li-cell-summary--confirmed': confirmed
      },
      classes
    )}
  >
    {children}
  </div>
);

export const CellSummaryGroup = ({ left, right, children }) => (
  <div
    className={
      left ? 'li-cell-summary-left-group' : 'li-cell-summary-right-group'
    }
  >
    {children}
  </div>
);

export const CellActionsContainer = ({ expanded, children }) => (
  <li
    className={classnames('li-cell-actions-container', {
      'li-cell-actions-container--expanded': expanded
    })}
  >
    {children}
  </li>
);

export const CellActionsContainerSection = ({ children }) => (
  <div className="li-cell-actions-container-section">{children}</div>
);

export const CellActionsContainerInfo = ({ classes, children }) => (
  <div className={classnames('li-cell-actions-container-info', classes)}>
    {children}
  </div>
);

export const CellActions = ({ classes, children }) => (
  <div className={classnames('li-cell-actions', classes)}>{children}</div>
);

export const CellActionField = ({ classes, children }) => (
  <div className={classnames(classes, 'li-cell-actions-field')}>{children}</div>
);

export const CellActionsValue = ({ classes, children }) => (
  <div className={classnames(classes, 'li-cell-actions-value')}>{children}</div>
);

export const PaymentPanelContainer = ({ children }) => (
  <div className="payment-panel-container">{children}</div>
);

export const PaymentPanel = ({ left, right, children }) => (
  <div
    className={classnames('payment-panel', {
      'payment-panel--left': left,
      'payment-panel--right': right
    })}
  >
    {children}
  </div>
);

export const PaymentContainer = ({ children }) => (
  <div className="payment-container">{children}</div>
);

export const PaymentForm = ({ label, children }) => (
  <form>
    <div className="payment-form">
      <div className="payment-form-label">{label}</div>
      {children}
    </div>
  </form>
);

export const PaymentTypeButtonGroup = ({ children, classes }) => (
  <div className={classnames('payment-type-button-group', classes)}>
    {children}
  </div>
);

export const PaymentCustomer = ({ children }) => (
  <div className="payment-customer">{children}</div>
);

export const PaymentCustomerContent = ({ children }) => (
  <div className="payment-customer-content">{children}</div>
);

export const PaymentCustomerInfo = ({ children }) => (
  <div className="payment-customer-info">{children}</div>
);

export const PaymentCustomerBalance = ({ type, children }) => (
  <div className="payment-customer-balance">
    <div className="vd-text--sub">{type}</div>
    {children}
  </div>
);

export const PaymentCustomerBalanceValue = ({ children }) => (
  <div className="payment-customer-balance-value">{children}</div>
);
