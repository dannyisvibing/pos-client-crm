import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import RBInput from '../../../rombostrap/components/RBInputV1';
import { Table, THead, TBody, TFoot, TR, TH, TD } from './DataTable';
import displayRound from '../../../utils/displayRound';

const CashManagementTitle = () => (
  <div className="wr-cash-management-row-title">
    <div className="vd-text-truncate vd-prs">Cash</div>
    <div className="wr-cash-management-row-title vd-text--sub vd-text--secondary">
      <div className="vd-text-truncate vd-prs">
        View Cash Payments, Floats and Movements
      </div>
    </div>
  </div>
);

class WRRegisterClosureSummary extends Component {
  state = {
    expandedIndex: 0
  };

  handleCashExpand = () => {
    if (this.state.expandedIndex === 0) {
      this.setState({ expandedIndex: -1 });
    } else {
      this.setState({ expandedIndex: 0 });
    }
  };

  isInvalid(name) {
    const { formState } = this.props;
    if (!formState || !formState.children) return true;
    return ((formState.children || {})[name] || {}).invalid;
  }

  render() {
    const {
      currencySymbol,
      giftCardEnabled,
      loyaltyEnabled,
      storeCreditEnabled,
      paidCash,
      cashMovements,
      paidCreditCard,
      paidGiftCard,
      paidLoyalty,
      paidStoreCredit,
      countedCash,
      countedCreditCard,
      onCountedCashChange,
      onCountedCreditCardChange,
      onFormElementStateChanged
    } = this.props;

    var totalCash =
      paidCash +
      cashMovements.reduce((total, movement) => {
        total += movement.amount;
        return total;
      }, 0);
    return (
      <Table fixed report expandable>
        <THead>
          <TR>
            <TH classes="vd-truncate">Payment Types</TH>
            <TH classes="wr-closure-summary-table-column vd-align-right">
              Expected ({currencySymbol})
            </TH>
            <TH classes="wr-closure-summary-table-column vd-align-right">
              Counted ({currencySymbol})
            </TH>
            <TH classes="wr-closure-summary-table-column vd-align-right">
              Differences ({currencySymbol})
            </TH>
          </TR>
        </THead>
        <TBody>
          {/*Cash*/}
          <TR
            classes="wr-closure-summary-table-row"
            expandable
            expanded={this.state.expandedIndex === 0}
            onClick={this.handleCashExpand}
          >
            <TD>
              <CashManagementTitle />
            </TD>
            <TD classes="wr-data-table-cell--number wr-closure-summary-table-expected-field">
              {totalCash}
            </TD>
            <TD classes="wr-data-table-cell--number wr-closure-summary-table-counted-field">
              <div className="wr-closure-summary-table-input-field">
                <i
                  className="fa fa-exclamation-triangle vd-mrm wr-closure-summary-table-field-error-icon"
                  style={{
                    visibility: this.isInvalid('cashCounted')
                      ? 'visible'
                      : 'hidden'
                  }}
                />
                <RBInput
                  classes="wr-data-table-cell-input"
                  textAlign="right"
                  placeholder="Enter amount"
                  rbNumberEnabled
                  rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
                  value={countedCash}
                  onInputChange={onCountedCashChange}
                  onClick={e => e.stopPropagation()}
                  onStateChange={state =>
                    onFormElementStateChanged('cashCounted', state)
                  }
                />
              </div>
            </TD>
            <TD classes="wr-data-table-cell--number wr-closure-summary-table-differences-field">
              <span>{displayRound(parseFloat(countedCash) - totalCash)}</span>
            </TD>
          </TR>
          <TR>
            <TD nestedReportContainer colSpan="4">
              <Table report nestedReport nestedIndentedReport>
                <TBody>
                  {/* Cash float is set*/}
                  <TR>
                    <TD classes="vd-tight vd-valign-t">
                      <div className="wr-cash-management-table-title">
                        Cash Movements
                      </div>
                    </TD>
                    <TD>
                      <Table classes="wr-cash-management-table-container">
                        <THead>
                          <TR>
                            <TH classes="vd-no-pad-l vd-truncate">Time</TH>
                            <TH classes="vd-truncate">User</TH>
                            <TH classes="vd-no-pad-l vd-no-pad-r vd-align-right vd-truncate">
                              Amount ({currencySymbol})
                            </TH>
                            <TH classes="vd-no-pad-r">Reason</TH>
                          </TR>
                        </THead>
                        <TBody>
                          {cashMovements.map((movement, i) => (
                            <TR key={i}>
                              <TD classes="vd-truncate vd-no-pad-l">
                                {moment(movement.time).format('h:mma')}
                              </TD>
                              <TD classes="wr-cash-management-table-user">
                                {movement.userName}
                              </TD>
                              <TD classes="vd-no-pad-l vd-no-pad-r vd-align-right">
                                <span
                                  className={classnames({
                                    'wr-number-colour-positive':
                                      movement.color === 'positive',
                                    'wr-number-colour-negative':
                                      movement.color === 'negative'
                                  })}
                                >
                                  {displayRound(movement.amount)}
                                </span>
                              </TD>
                              <TD classes="vd-no-pad-r wr-cash-management-table-reason">
                                <div className="wr-movement-reason">
                                  <span className="wr-movement-reason-type">
                                    {movement.reason}
                                  </span>
                                  <span className="wr-movement-reason-note">
                                    {movement.note}
                                  </span>
                                </div>
                              </TD>
                            </TR>
                          ))}
                        </TBody>
                      </Table>
                    </TD>
                  </TR>
                  <TR>
                    <TD colSpan="100%">
                      <div className="vd-flex vd-flex--justify-between">
                        <div>Cash Payments Received</div>
                        <div className="wr-cash-mangement-table-total-expected">
                          {displayRound(paidCash)}
                        </div>
                      </div>
                    </TD>
                  </TR>
                </TBody>
              </Table>
            </TD>
          </TR>
          {/* Credit Card*/}
          <TR classes="wr-closure-summary-table-row" unexpandable>
            <TD>
              <div className="vd-text-truncate">Credit Card</div>
            </TD>
            <TD classes="wr-data-table-cell--number wr-closure-summary-table-expected-field">
              {displayRound(paidCreditCard)}
            </TD>
            <TD classes="wr-data-table-cell--number wr-closure-summary-table-counted-field">
              <div className="wr-closure-summary-table-input-field">
                <i
                  className="fa fa-exclamation-triangle vd-mrm wr-closure-summary-table-field-error-icon"
                  style={{
                    visibility: this.isInvalid('creditCardCounted')
                      ? 'visible'
                      : 'hidden'
                  }}
                />
                <RBInput
                  classes="wr-data-table-cell-input"
                  textAlign="right"
                  placeholder="Enter amount"
                  rbNumberEnabled
                  rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
                  value={countedCreditCard}
                  onInputChange={onCountedCreditCardChange}
                  onStateChange={state =>
                    onFormElementStateChanged('creditCardCounted', state)
                  }
                />
              </div>
            </TD>
            <TD classes="wr-data-table-cell--number wr-closure-summary-table-differences-field">
              <span>{displayRound(countedCreditCard - paidCreditCard)}</span>
            </TD>
          </TR>
          <TR />
          {/* Gift Card*/}
          {giftCardEnabled ? (
            <TR classes="wr-closure-summary-table-row" unexpandable>
              <TD>
                <div className="vd-text-truncate">Gift Card</div>
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-expected-field">
                {displayRound(paidGiftCard)}
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-counted-field">
                <div className="wr-closure-summary-table-input-field">
                  <div className="wr-closure-summary-table-counted-read-only">
                    {displayRound(paidGiftCard)}
                  </div>
                </div>
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-differences-field">
                <span>0.00</span>
              </TD>
            </TR>
          ) : (
            undefined
          )}
          {giftCardEnabled ? <TR /> : undefined}
          {/* Loyalty*/}
          {loyaltyEnabled ? (
            <TR classes="wr-closure-summary-table-row" unexpandable>
              <TD>
                <div className="vd-text-truncate">Loyalty</div>
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-expected-field">
                {displayRound(paidLoyalty)}
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-counted-field">
                <div className="wr-closure-summary-table-input-field">
                  <div className="wr-closure-summary-table-counted-read-only">
                    {displayRound(paidLoyalty)}
                  </div>
                </div>
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-differences-field">
                <span>0.00</span>
              </TD>
            </TR>
          ) : (
            undefined
          )}
          {loyaltyEnabled ? <TR /> : undefined}
          {/* Store Credit*/}
          {storeCreditEnabled ? (
            <TR classes="wr-closure-summary-table-row" unexpandable>
              <TD>
                <div className="vd-text-truncate">Store Credit</div>
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-expected-field">
                {displayRound(paidStoreCredit)}
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-counted-field">
                <div className="wr-closure-summary-table-input-field">
                  <div className="wr-closure-summary-table-counted-read-only">
                    {displayRound(paidStoreCredit)}
                  </div>
                </div>
              </TD>
              <TD classes="wr-data-table-cell--number wr-closure-summary-table-differences-field">
                <span>0.00</span>
              </TD>
            </TR>
          ) : (
            undefined
          )}
          {storeCreditEnabled ? <TR /> : undefined}
        </TBody>
        <TFoot>
          <TR classes="wr-closure-summary-totals">
            <TD>
              <div className="vd-text-truncate">Totals</div>
            </TD>
            <TD classes="wr-data-table-cell--number">
              {displayRound(
                paidCreditCard +
                  (giftCardEnabled ? paidGiftCard : 0) +
                  (loyaltyEnabled ? paidLoyalty : 0) +
                  (storeCreditEnabled ? paidStoreCredit : 0) +
                  totalCash
              )}
            </TD>
            <TD classes="wr-data-table-cell--number">
              <div className="wr-closure-summary-table-counted-read-only">
                {displayRound(
                  parseFloat(countedCash) + parseFloat(countedCreditCard)
                )}
              </div>
            </TD>
            <TD classes="wr-data-table-cell--number">
              {displayRound(
                parseFloat(countedCash) +
                  parseFloat(countedCreditCard) -
                  totalCash -
                  paidCreditCard
              )}
            </TD>
          </TR>
        </TFoot>
      </Table>
    );
  }
}

export default WRRegisterClosureSummary;
