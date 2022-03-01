import React from 'react';
import {
  PaymentPanelContainer,
  PaymentPanel,
  SaleSummary,
  SaleSummaryHeader,
  SaleSummarySection,
  SaleSummaryList,
  Cell,
  CellSummaryContainer,
  CellSummaryGroup,
  CellSummary,
  CellSummaryContainerNotes,
  SaleSummaryLine,
  SaleSummaryLineItem,
  PaymentContainer,
  PaymentForm,
  PaymentTypeButtonGroup,
  PaymentCustomer,
  PaymentCustomerContent,
  PaymentCustomerInfo,
  PaymentCustomerBalance,
  PaymentCustomerBalanceValue
} from './SalePageLayout';
import Scrollable from '../../common/components/Scrollable';
import { RBButton, RBInput } from '../../../rombostrap';
import displayRound from '../../../utils/displayRound';
import { LineItemTotalPrice, LineItemTotalBasePrice } from './ReceiptBuilder';
import { getLineItemDisplayPrice } from '../../../modules/sale';
import CustomerBadge from '../../common/components/CustomerBadge';

const PaymentControlPanel = props => {
  const {
    saleInProgress,
    saleActionLabel,
    paymentMethods,
    formatCurrency,
    onClickBack,
    onTenderedAmountChange,
    onPay
  } = props;
  const {
    customerId,
    lineItems,
    saleTotalDiscount,
    saleTaxBreakdown,
    saleTotalTax,
    saleTotalPrice,
    saleSubTotal,
    salePayments,
    saleBalance,
    saleSafeNote,
    tenderedAmount
  } = saleInProgress;
  const customer = props.getCustomer(customerId);
  const customerGroup = props.getCustomerGroup(customer.customerGroupId);
  return (
    <PaymentPanelContainer>
      <PaymentPanel left>
        <SaleSummary>
          <Scrollable>
            <SaleSummaryHeader>Sale Summary</SaleSummaryHeader>
            <SaleSummarySection saleItems>
              <SaleSummaryList>
                {lineItems.map((lineItem, lineIndex) => (
                  <li key={lineIndex}>
                    <Cell readonly>
                      <CellSummaryContainer readonly>
                        <CellSummaryGroup left>
                          <CellSummary quantity classes="vd-text-label">
                            {lineItem.quantity}
                          </CellSummary>
                          <CellSummary nameContainer>
                            <CellSummary classes="pro-li-cell-summary-name vd-text-label">
                              {lineItem.name}
                              <div className="vd-text-supplementary">
                                {lineItem.variantName}
                              </div>
                            </CellSummary>
                          </CellSummary>
                        </CellSummaryGroup>
                        <CellSummaryGroup right>
                          <CellSummary unitPrice>
                            {displayRound(lineItem.price)}
                          </CellSummary>
                          <CellSummary totals>
                            <LineItemTotalPrice
                              totalPrice={displayRound(
                                getLineItemDisplayPrice(lineItem)
                              )}
                            />
                            {lineItem.discountRate > 0 && (
                              <LineItemTotalBasePrice
                                price={displayRound(
                                  lineItem.basePrice * lineItem.quantity
                                )}
                              />
                            )}
                          </CellSummary>
                        </CellSummaryGroup>
                      </CellSummaryContainer>
                      {lineItem.note && (
                        <CellSummaryContainerNotes classes="vd-text-supplementary">
                          <div className="wr-honour-line-breaks">
                            Note: {lineItem.note}
                          </div>
                        </CellSummaryContainerNotes>
                      )}
                    </Cell>
                  </li>
                ))}
              </SaleSummaryList>
            </SaleSummarySection>
            <SaleSummarySection indent subtotals>
              <SaleSummaryList>
                <SaleSummaryLine subTotal>
                  <SaleSummaryLineItem label>Sub-total</SaleSummaryLineItem>
                  <SaleSummaryLineItem value>
                    {formatCurrency(saleSubTotal)}
                  </SaleSummaryLineItem>
                </SaleSummaryLine>
                {saleTotalDiscount > 0 && (
                  <SaleSummaryLine discount>
                    <SaleSummaryLineItem label>Discount</SaleSummaryLineItem>
                    <SaleSummaryLineItem value>
                      {formatCurrency(saleTotalDiscount)}
                    </SaleSummaryLineItem>
                  </SaleSummaryLine>
                )}
                <SaleSummaryLine tax>
                  <SaleSummaryLineItem label>
                    {saleTaxBreakdown.length > 1
                      ? `Tax (${saleTaxBreakdown.length} taxes)`
                      : saleTaxBreakdown.length === 1
                        ? `Tax (${saleTaxBreakdown[0].name})`
                        : 'Tax (No Tax)'}
                  </SaleSummaryLineItem>
                  <SaleSummaryLineItem value>
                    {formatCurrency(saleTotalTax)}
                  </SaleSummaryLineItem>
                </SaleSummaryLine>
                {saleTaxBreakdown.length > 1 &&
                  saleTaxBreakdown.map((breakdown, index) => (
                    <SaleSummaryLine key={index} taxBreakdown>
                      <SaleSummaryLineItem label>
                        {breakdown.name}
                      </SaleSummaryLineItem>
                      <SaleSummaryLineItem value>
                        {formatCurrency(breakdown.taxAmount)}
                      </SaleSummaryLineItem>
                    </SaleSummaryLine>
                  ))}
              </SaleSummaryList>
            </SaleSummarySection>
            <SaleSummarySection indent total>
              <SaleSummaryList>
                <SaleSummaryLine total>
                  <SaleSummaryLineItem label>
                    <span className="vd-text-signpost">Total</span>
                    <span className="vd-text-supplementary">
                      {lineItems.length} items
                    </span>
                  </SaleSummaryLineItem>
                  <SaleSummaryLineItem value>
                    {formatCurrency(saleTotalPrice)}
                  </SaleSummaryLineItem>
                </SaleSummaryLine>
              </SaleSummaryList>
            </SaleSummarySection>
            {salePayments.length > 0 && (
              <SaleSummarySection indent payments>
                <SaleSummaryList>
                  {salePayments.map((payment, index) => (
                    <SaleSummaryLine
                      key={index}
                      classes="wr-sale-summary-payments"
                    >
                      <SaleSummaryLineItem label>
                        <span className="pro-sale-summary-payment-name">
                          {payment.methodName}
                        </span>
                        <div className="vd-text-supplementary">
                          {payment.paidDate}
                        </div>
                      </SaleSummaryLineItem>
                      <SaleSummaryLineItem value>
                        {formatCurrency(payment.amount)}
                      </SaleSummaryLineItem>
                    </SaleSummaryLine>
                  ))}
                </SaleSummaryList>
              </SaleSummarySection>
            )}
            {salePayments.length > 0 &&
              saleBalance !== 0 && (
                <SaleSummarySection indent balance>
                  <SaleSummaryList>
                    <SaleSummaryLine>
                      <SaleSummaryLineItem label classes="vd-text-signpost">
                        Balance
                      </SaleSummaryLineItem>
                      <SaleSummaryLineItem value classes="vd-text-intro">
                        {formatCurrency(saleBalance)}
                      </SaleSummaryLineItem>
                    </SaleSummaryLine>
                  </SaleSummaryList>
                </SaleSummarySection>
              )}
            {saleSafeNote && (
              <SaleSummarySection note>
                <div className="wr-honour-line-breaks">
                  Note: {saleSafeNote}
                </div>
              </SaleSummarySection>
            )}
          </Scrollable>
        </SaleSummary>
      </PaymentPanel>
      <PaymentPanel right>
        <PaymentContainer>
          <RBButton
            modifiers={['text']}
            category="secondary"
            classes="payment-close"
            onClick={onClickBack}
          >
            <i className="fa fa-arrow-left vd-mrs" />
            Back to Sale
          </RBButton>
          <PaymentForm label={saleActionLabel}>
            <RBInput
              value={tenderedAmount}
              textAlign="right"
              rbNumberEnabled
              rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
              onInputChange={onTenderedAmountChange}
              classes="wr-input--amount-tendered"
            />
          </PaymentForm>
          <PaymentTypeButtonGroup classes="vd-button-group">
            {paymentMethods
              .filter(method => method.normal === 1)
              .map((method, index) => (
                <RBButton
                  key={index}
                  modifiers={['big']}
                  category={saleBalance > 0 ? 'primary' : 'negative'}
                  classes="btn--payment-type"
                  onClick={() => onPay(method.methodId)}
                >
                  {method.name}
                </RBButton>
              ))}
          </PaymentTypeButtonGroup>
          <PaymentCustomer>
            <h5 className="payment-section-header">Customer</h5>
            <PaymentCustomerContent>
              <PaymentCustomerInfo>
                <CustomerBadge
                  name={`${customer.firstname} ${customer.lastname}`}
                  group={customerGroup.name || 'All Customers'}
                  customerCode={customer.code}
                  countryCode={customer.physicalCountry}
                  onClick={() => {}}
                />
              </PaymentCustomerInfo>
              <PaymentCustomerBalance type="Store Credit">
                <PaymentCustomerBalanceValue>
                  {formatCurrency(0)}
                </PaymentCustomerBalanceValue>
              </PaymentCustomerBalance>
              <PaymentCustomerBalance type="Account Balance">
                <PaymentCustomerBalanceValue>
                  {formatCurrency(0)}
                </PaymentCustomerBalanceValue>
              </PaymentCustomerBalance>
              <PaymentCustomerBalance type="Loyalty">
                <PaymentCustomerBalanceValue>
                  {formatCurrency(0)}
                </PaymentCustomerBalanceValue>
              </PaymentCustomerBalance>
            </PaymentCustomerContent>
          </PaymentCustomer>
          <PaymentTypeButtonGroup classes="vd-button-group">
            {saleBalance >= 0 ? (
              paymentMethods
                .filter(method => method.normal === 0)
                .map((method, index) => (
                  <RBButton
                    key={index}
                    modifiers={['big']}
                    category="secondary"
                    disabled={method.disabled}
                    classes="btn--payment-type"
                    onClick={() => onPay(method.methodId)}
                  >
                    {method.name}
                  </RBButton>
                ))
            ) : (
              <RBButton
                modifiers={['big']}
                category="secondary"
                classes="btn--payment-type"
                onClick={() => onPay('method:store_credit')}
              >
                Store Credit
              </RBButton>
            )}
          </PaymentTypeButtonGroup>
        </PaymentContainer>
      </PaymentPanel>
    </PaymentPanelContainer>
  );
};

export default PaymentControlPanel;
