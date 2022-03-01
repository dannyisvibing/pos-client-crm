import React from 'react';
import _ from 'lodash';
import {
  Container,
  SaleActions,
  SaleHeader,
  SaleBody,
  SaleList,
  SaleListItem,
  Cell,
  CellSummaryContainer,
  CellSummary,
  CellActionsContainer,
  CellActionsContainerSection,
  CellActions,
  CellActionField,
  CellActionsValue,
  CellActionsContainerInfo,
  SaleListFooter,
  SaleTotals,
  SaleTotalLine,
  SaleTotalLineItemValue,
  SaleFooter
} from './SalePageLayout';
import SearchForCustomers from '../../common/containers/SearchForCustomersContainer';
import SaleCustomer from './SaleCustomer';
import {
  RBButton,
  RBField,
  RBInput,
  RBLink,
  RBFlex
} from '../../../rombostrap';
import {
  getLineItemDisplayPrice,
  getLineItemDisplayUnitPrice
} from '../../../modules/sale';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import { TextArea } from '../../common/legacy/Basic';
import RBPopover, {
  RBPopoverContainer,
  RBPopoverContent,
  RBPopoverTarget
} from '../../../rombostrap/components/RBPopover';
import Discount from './Discount';
import SaleTax from './SaleTax';
import displayRound from '../../../utils/displayRound';
import CurrencyCodes from '../../../constants/currencies.json';
import '../styles/SaleReceipt.css';

export const LineItemTotalPrice = ({ totalPrice }) => (
  <CellSummary totalPrice>
    <span className="wr-li-cell-summary-price-value vd-text-label">
      {totalPrice}
    </span>
  </CellSummary>
);

export const LineItemTotalBasePrice = ({ price }) => (
  <CellSummary totalBasePrice>{price}</CellSummary>
);

const ReceiptBuilder = props => {
  const {
    saleInProgress,
    currentRegister,
    formatCurrency,
    saleActionLabel,
    onDismiss,
    onPark,
    onDiscard,
    onClickCustomerSuggestion,
    onShowCustomerDetail,
    onRemoveCustomer,
    onClickLineItem,
    onChangeLineItem,
    onRemoveLineItem,
    onChangeSafeNote,
    onClosePopover,
    onClickDiscount,
    onResetSaleDiscount,
    onDiscountTypeChange,
    onDiscountAmountChange,
    onClickTax,
    onTaxRemove,
    onClickPay
  } = props;
  const {
    customerId,
    lineItems,
    saleSafeNote,
    saleSubTotal,
    saleTotalDiscount,
    saleDiscountType,
    saleDiscountAmount,
    saleTaxBreakdown,
    saleTotalTax,
    saleTotalPrice,
    salePayments,
    saleBalance
  } = saleInProgress;
  const customer = props.getCustomer(customerId);
  const customerGroup = props.getCustomerGroup(customer.customerGroupId) || {};
  const currentOutlet = props.getOutletById(currentRegister.outletId);
  const currency = _.find(CurrencyCodes, {
    code: props.retailerSettings.defaultCurrency
  }) || { symbol: '$' };
  return (
    <Container>
      {props.isSaleConfirmed ? (
        <SaleActions>
          <RBButton
            modifiers={['text']}
            category="secondary"
            onClick={onDismiss}
          >
            <i className="fa fa-close vd-mrs" />
            Dismiss Sale
          </RBButton>
        </SaleActions>
      ) : (
        <SaleActions>
          <RBButton
            modifiers={['text']}
            category="secondary"
            disabled={props.isSaleNotStarted}
            onClick={onPark}
          >
            <i className="fa fa-rotate-left vd-mrs" />
            Park Sale
          </RBButton>
          <RBButton
            modifiers={['text']}
            category="secondary"
            disabled={props.isSaleNotStarted}
            onClick={onDiscard}
          >
            <i className="fa fa-trash vd-mrs" />
            Discard Sale
          </RBButton>
        </SaleActions>
      )}
      <form className="sale">
        <SaleHeader>
          {!Boolean(customerId) ? (
            <div className="vd-pas wr-customer-search">
              <SearchForCustomers handler={onClickCustomerSuggestion} />
            </div>
          ) : (
            <SaleCustomer
              name={`${customer.firstname} ${customer.lastname}`}
              group={customerGroup.name || 'All Customers'}
              customerCode={customer.code}
              countryCode={customer.physicalCountry}
              confirmed={props.isSaleConfirmed}
              onShowDetail={onShowCustomerDetail}
              onRemoveCustomer={onRemoveCustomer}
            />
          )}
        </SaleHeader>
        <SaleBody>
          <SaleList>
            {lineItems.map((lineItem, lineIndex) => {
              return (
                <SaleListItem key={lineIndex}>
                  <Cell expanded={lineIndex === props.expandedLineItemIndex}>
                    <CellSummaryContainer
                      onClick={() => onClickLineItem(lineIndex)}
                    >
                      {lineItem.quantityWarn &&
                      currentOutlet.warnNegativeInventory ? (
                        <CellSummary quantity>
                          <span>
                            <i className="fa fa-exclamation-triangle wr-input-error-icon" />
                          </span>
                        </CellSummary>
                      ) : (
                        <CellSummary
                          quantity
                          quantityNegative={lineItem.quantity < 0}
                        >
                          <span>{lineItem.quantity}</span>
                        </CellSummary>
                      )}
                      <CellSummary nameContainer>
                        <CellSummary name>
                          <strong>{lineItem.name}</strong>
                          <div className="vd-text-supplementary vd-text--secondary vd-text-truncate">
                            {lineItem.variantName}
                          </div>
                        </CellSummary>
                      </CellSummary>
                      <CellSummary totalsContainer>
                        <LineItemTotalPrice
                          totalPrice={displayRound(
                            getLineItemDisplayPrice(lineItem)
                          )}
                        />
                        {lineItem.discountRate > 0 && (
                          <LineItemTotalBasePrice
                            price={lineItem.basePrice * lineItem.quantity}
                          />
                        )}
                      </CellSummary>
                      {lineItem.confirmed ? (
                        <CellSummary confirmed>
                          <i className="fa fa-lock li-cell-actions-locked-icon" />
                        </CellSummary>
                      ) : (
                        <RBButton
                          modifiers={['icon']}
                          category="negative"
                          classes="li-cell-summary--remove"
                          onClick={e => {
                            e.preventDefault();
                            onRemoveLineItem(lineIndex);
                          }}
                        >
                          <i className="fa fa-trash" />
                        </RBButton>
                      )}
                    </CellSummaryContainer>
                    <CellActionsContainer
                      expanded={lineIndex === props.expandedLineItemIndex}
                    >
                      <CellActionsContainerSection>
                        <div className="vd-flex">
                          <CellActions>
                            {lineItem.confirmed ? (
                              <CellActionField>
                                <div className="vd-label">Quantity</div>
                                <CellActionsValue classes="vd-value">
                                  {lineItem.quantity}
                                </CellActionsValue>
                              </CellActionField>
                            ) : (
                              <RBField classes="li-cell-actions-field">
                                <RBLabel>Quantity</RBLabel>
                                <RBValue classes="li-cell-actions-value">
                                  <RBInput
                                    textAlign="right"
                                    classes="li-input--quantity"
                                    value={lineItem.quantity}
                                    rbNumberEnabled
                                    rbNumberOptions={{
                                      decimalPlaces: 0,
                                      stripNonNumeric: true
                                    }}
                                    onInputChange={quantity =>
                                      onChangeLineItem(lineIndex, { quantity })
                                    }
                                  />
                                </RBValue>
                              </RBField>
                            )}
                          </CellActions>
                          <CellActions>
                            {lineItem.confirmed || lineItem.quantity < 0 ? (
                              <CellActionField>
                                <div className="vd-label">Price</div>
                                <CellActionsValue classes="vd-value">
                                  {displayRound(
                                    getLineItemDisplayUnitPrice(lineItem)
                                  )}
                                </CellActionsValue>
                              </CellActionField>
                            ) : (
                              <RBField classes="li-cell-actions-field">
                                <RBLabel>Price</RBLabel>
                                <RBValue classes="li-cell-actions-value">
                                  <RBInput
                                    textAlign="right"
                                    classes="li-input--price"
                                    value={lineItem.price}
                                    rbNumberEnabled
                                    rbNumberOptions={{
                                      decimalPlaces: 2,
                                      stripNonNumeric: true
                                    }}
                                    onInputChange={price =>
                                      onChangeLineItem(lineIndex, { price })
                                    }
                                  />
                                </RBValue>
                              </RBField>
                            )}
                          </CellActions>
                          <CellActions>
                            {lineItem.basePrice < lineItem.price ? (
                              <CellActionField classes="vd-field">
                                <div className="vd-label">Markup (%)</div>
                                <CellActionsValue>
                                  {displayRound(lineItem.markup)}
                                </CellActionsValue>
                              </CellActionField>
                            ) : lineItem.confirmed || lineItem.quantity < 0 ? (
                              <CellActionField>
                                <div className="vd-label">Discount (%)</div>
                                <CellActionsValue classes="vd-value">
                                  {displayRound(lineItem.discountRate)}
                                </CellActionsValue>
                              </CellActionField>
                            ) : (
                              <RBField classes="li-cell-actions-field">
                                <RBLabel>Discount (%)</RBLabel>
                                <RBValue classes="li-cell-actions-value">
                                  <RBInput
                                    textAlign="right"
                                    classes="li-input--discount-percent"
                                    value={lineItem.discountRate}
                                    rbNumberEnabled
                                    rbNumberOptions={{
                                      decimalPlaces: 2,
                                      stripNonNumeric: true
                                    }}
                                    onInputChange={discountRate =>
                                      onChangeLineItem(lineIndex, {
                                        discountRate
                                      })
                                    }
                                  />
                                </RBValue>
                              </RBField>
                            )}
                          </CellActions>
                        </div>
                        {lineItem.quantityWarn &&
                          currentOutlet.warnNegativeInventory && (
                            <div className="wr-input-messages wr-media wr-media-center">
                              <span>
                                <i className="wr-media-object fa fa-exclamation-triangle" />
                              </span>
                              <div className="wr-media-body">
                                You only have 0 available.
                                <RBLink secondary>Continue anyway?</RBLink>
                              </div>
                            </div>
                          )}
                        <div className="vd-pbs vd-pts">
                          {!lineItem.confirmed ? (
                            <TextArea
                              label="Notes"
                              placeholder="Type to add notes"
                              value={lineItem.note}
                              onChange={e =>
                                onChangeLineItem(lineIndex, {
                                  note: e.target.value
                                })
                              }
                            />
                          ) : (
                            lineItem.note && (
                              <div className="vd-field">
                                <div className="vd-label">Notes</div>
                                <div className="vd-value">{lineItem.note}</div>
                              </div>
                            )
                          )}
                        </div>
                        <CellActionsContainerInfo classes="vd-pts">
                          <RBLink classes="wr-li-view-product-info">
                            <i className="fa fa-info-circle vd-mrs" />
                            Show Inventory & Details
                          </RBLink>
                        </CellActionsContainerInfo>
                      </CellActionsContainerSection>
                    </CellActionsContainer>
                  </Cell>
                </SaleListItem>
              );
            })}
          </SaleList>
          <SaleListFooter>
            <TextArea
              classes="sale-note vd-mbn"
              placeholder="Add safe note"
              value={saleSafeNote}
              onChange={onChangeSafeNote}
            />
            <SaleTotals>
              <SaleTotalLine subtotal>
                <div>Sub-total</div>
                <SaleTotalLineItemValue>
                  {formatCurrency(saleSubTotal)}
                </SaleTotalLineItemValue>
              </SaleTotalLine>
              {props.isSaleConfirmed ? (
                <SaleTotalLine discount>
                  <div>Discount</div>
                  <SaleTotalLineItemValue>
                    {formatCurrency(saleTotalDiscount)}
                  </SaleTotalLineItemValue>
                </SaleTotalLine>
              ) : (
                <SaleTotalLine discount>
                  <RBPopover
                    id="discount-popover"
                    abuttedLeft={false}
                    targetMiddle
                    targetLeft
                    containerMiddle
                    containerRight
                    open={props.isOpenDiscountPopover}
                    onRequestClose={onClosePopover}
                  >
                    <RBPopoverTarget>
                      <RBLink isNavLink={false} onClick={onClickDiscount}>
                        Discount
                      </RBLink>
                    </RBPopoverTarget>
                    <RBPopoverContainer classes="wr-discount-popover">
                      <RBPopoverContent>
                        <Discount
                          type={saleDiscountType}
                          amount={saleDiscountAmount}
                          currencySymbol={currency.symbol}
                          onRemove={onResetSaleDiscount}
                          onTypeChange={onDiscountTypeChange}
                          onAmountChange={onDiscountAmountChange}
                        />
                      </RBPopoverContent>
                    </RBPopoverContainer>
                  </RBPopover>
                  <SaleTotalLineItemValue>
                    {formatCurrency(saleTotalDiscount)}
                  </SaleTotalLineItemValue>
                </SaleTotalLine>
              )}
              <SaleTotalLine totalTax>
                <RBPopover
                  id="tax-popover"
                  abuttedLeft={false}
                  targetMiddle
                  targetLeft
                  containerMiddle
                  containerRight
                  open={props.isOpenTaxPopover}
                  onRequestClose={onClosePopover}
                >
                  <RBPopoverTarget>
                    {saleTaxBreakdown.length === 0 ||
                    (saleTaxBreakdown.length === 1 &&
                      saleTaxBreakdown[0].taxAmount === 0) ? (
                      <div>Tax (No Tax)</div>
                    ) : (
                      <RBLink isNavLink={false} onClick={onClickTax}>
                        {saleTaxBreakdown.length > 1
                          ? `Tax (${saleTaxBreakdown.length} taxes)`
                          : `Tax (${saleTaxBreakdown[0].name})`}
                      </RBLink>
                    )}
                  </RBPopoverTarget>
                  <RBPopoverContainer classes="wr-discount-popover">
                    <RBPopoverContent>
                      <SaleTax
                        taxBreakdown={saleTaxBreakdown}
                        onRemove={onTaxRemove}
                      />
                    </RBPopoverContent>
                  </RBPopoverContainer>
                </RBPopover>
                <SaleTotalLineItemValue>
                  {formatCurrency(saleTotalTax)}
                </SaleTotalLineItemValue>
              </SaleTotalLine>
              <SaleTotalLine total>
                <div>
                  Total
                  <span className="vd-text--sub">
                    ({lineItems.length} items)
                  </span>
                </div>
                <SaleTotalLineItemValue>
                  {formatCurrency(saleTotalPrice)}
                </SaleTotalLineItemValue>
              </SaleTotalLine>
              {salePayments.length > 0 && (
                <SaleTotalLine>
                  Payments
                  <SaleTotalLineItemValue>
                    {formatCurrency(
                      salePayments.reduce((totalPayment, payment) => {
                        totalPayment += parseFloat(payment.amount);
                        return totalPayment;
                      }, 0)
                    )}
                  </SaleTotalLineItemValue>
                </SaleTotalLine>
              )}
            </SaleTotals>
          </SaleListFooter>
        </SaleBody>
        <SaleFooter>
          <RBButton
            classes="btn-pay"
            modifiers={['big']}
            category={saleBalance < 0 ? 'negative' : 'primary'}
            onClick={onClickPay}
            disabled={lineItems.length === 0 || !customer}
          >
            <RBFlex flex flexJustify="between">
              <div className="pay-action pay-action-label">
                {saleActionLabel}
              </div>
              <div className="pay-action pay-action-value">
                {formatCurrency(saleBalance)}
              </div>
            </RBFlex>
          </RBButton>
        </SaleFooter>
      </form>
    </Container>
  );
};

export default ReceiptBuilder;
