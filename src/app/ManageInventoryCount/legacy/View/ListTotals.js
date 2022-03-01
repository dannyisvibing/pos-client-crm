import React, { Component } from 'react';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';
import _ from 'lodash';
import { vn } from 'vend-number';
import classnames from 'classnames';
import Tooltip from '../Shared/Tooltip';

class ListTotals extends Component {
  state = {};

  componentWillMount() {
    this._onMouseEnter = e => {
      this.setState({ showTotalsInfo: true });
    };
    this._onMouseLeave = e => {
      this.setState({ showTotalsInfo: false });
    };

    this.computeTotals();
  }

  componentDidMount() {
    this.addEventListeners();
  }

  componentWillReceiveProps(nextProps) {
    this.computeTotals();
  }

  componentDidUpdate(prevProps, prevState) {
    this.removeEventListeners();
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  computeTotals() {
    var totals;
    // if (stocktake.isCompleteProcessed()) {
    // totals = this._getApiTotals();
    // } else {
    totals = this._calculateTotals();
    // }

    totals.costDifference = vn(totals.costGain)
      .plus(totals.countLoss)
      .toString();
    totals.countDifference = vn(totals.countGain)
      .plus(totals.countLoss)
      .toString();
    this.setState({ totals });
  }

  addEventListeners() {
    if (this.totalsRef) {
      this.totalsRef.addEventListener('mouseenter', this._onMouseEnter, this);
      this.totalsRef.addEventListener('mouseleave', this._onMouseLeave, this);
    }
  }

  removeEventListeners() {
    if (this.totalsRef) {
      this.totalsRef.removeEventListener(
        'mouseenter',
        this._onMouseEnter,
        this
      );
      this.totalsRef.removeEventListener(
        'mouseleave',
        this._onMouseLeave,
        this
      );
    }
  }

  _getApiTotals() {
    const { stocktake } = this.props;
    return {
      costGain: stocktake.totalCostGain,
      costLoss: stocktake.totalCostLoss,
      countGain: stocktake.totalCountGain,
      countLoss: stocktake.totalCountLoss
    };
  }

  _calculateTotals() {
    const { stocktakeItems } = this.props;
    var totals = {
        costGain: vn(0),
        costLoss: vn(0),
        countGain: vn(0),
        countLoss: vn(0)
      },
      costField,
      countField;

    _.forEach(stocktakeItems, stocktakeItem => {
      var differenceCost = stocktakeItem.getDifferenceCost(),
        differenceCount = stocktakeItem.getDifferenceCount();

      if (differenceCost) {
        costField = differenceCost > 0 ? 'costGain' : 'costLoss';
        totals[costField] = totals[costField].plus(differenceCost);
      }

      if (differenceCount) {
        countField = differenceCount > 0 ? 'countGain' : 'countLoss';
        totals[countField] = totals[countField].plus(differenceCount);
      }
    });

    return _.mapValues(totals, total => {
      return total.toString();
    });
  }

  render() {
    const { totals, showTotalsInfo } = this.state;
    const {
      classes,
      isStocktakeInProgress,
      showCosts,
      formatCurrency
    } = this.props;
    return (
      <div className={classes}>
        <table className="table">
          <tbody>
            <tr className="table-row">
              {isStocktakeInProgress && (
                <td className="table-cell table-cell--checkbox-fixed" />
              )}
              <td className="table-cell table-cell--list-total">Total</td>
              <td
                className={classnames(
                  'table-cell table-cell--unit table-cell--right-aligned',
                  {
                    'table-cell--warning': totals.countDifference < 0,
                    'table-cell--success': totals.countDifference > 0
                  }
                )}
              >
                {totals.countDifference}
                {totals.countDifference.length && (
                  <span
                    ref={c => (this.totalsRef = c)}
                    className="ic-list__totals info-icon"
                  >
                    <i className="fa fa-info-circle" />
                    {showTotalsInfo && (
                      <Tooltip type="info">
                        <table>
                          <tbody>
                            <tr>
                              <td className="table-cell info-title">Gain</td>
                              <td className="table-cell table-cell--success">
                                {totals.countGain}
                              </td>
                              {showCosts && (
                                <td className="table-cell table-cell--success">
                                  {formatCurrency(+totals.costGain)}
                                </td>
                              )}
                            </tr>
                            <tr>
                              <td className="table-cell info-title">Loss</td>
                              <td className="table-cell table-cell--warning">
                                {totals.countLoss}
                              </td>
                              {showCosts && (
                                <td className="table-cell table-cell--warning">
                                  {formatCurrency(+totals.costLoss)}
                                </td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </Tooltip>
                    )}
                  </span>
                )}
              </td>
              {showCosts && (
                <td
                  className={classnames(
                    'table-cell table-cell--cost table-cell--right-aligned',
                    {
                      'table-cell--warning': totals.costDifference < 0,
                      'table-cell--success': totals.costDifference > 0
                    }
                  )}
                >
                  {formatCurrency(+totals.costDifference)}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withCurrencyFormatter(ListTotals);
