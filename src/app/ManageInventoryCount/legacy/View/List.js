import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import STATES from '../../../../constants/states';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';
import REVIEW_TAB_HEADINGS from '../../../../constants/stocktake/review-tab-heading';
import { RBCheckbox, RBFlag, RBLoader } from '../../../../rombostrap';
import StocktakeReviewActions from './Actions';
import Tooltip from '../Shared/Tooltip';
import StocktakeListTotals from './ListTotals';

var messages = {};

messages[STOCKTAKE_ITEM_STATUS.uncounted] = REVIEW_TAB_HEADINGS.uncounted;
messages[STOCKTAKE_ITEM_STATUS.unmatched] = REVIEW_TAB_HEADINGS.unmatched;
messages[STOCKTAKE_ITEM_STATUS.matched] = REVIEW_TAB_HEADINGS.matched;
messages[STOCKTAKE_ITEM_STATUS.excluded] = REVIEW_TAB_HEADINGS.excluded;

class List extends Component {
  state = {};

  componentWillMount() {
    this.setState({
      showCosts: true //rbActiveUser.hasPermission('product.cost.view')
    });
  }

  showDifferenceAndTotals() {
    var tabWithTotals = [
      STOCKTAKE_ITEM_STATUS.unmatched,
      STOCKTAKE_ITEM_STATUS.any
    ];
    return _.indexOf(tabWithTotals, this.props.selectedTab) > -1;
  }

  render() {
    const {
      selectedTab,
      selectedAll,
      stocktakeId,
      stocktake,
      stocktakeItems,
      filteredUnlimitedItems,
      selectedStocktakeItems,
      stateItems,
      recountStatus,
      onToggleSelectAll,
      onToggleSelect,
      onMarkItemAsExcluded,
      onResetCount
    } = this.props;
    const { showCosts } = this.state;
    const tabHeading = messages[selectedTab];
    const selectedCount = _.size(selectedStocktakeItems);

    return (
      <div>
        {stocktake.isInProgress() &&
          (!!filteredUnlimitedItems.length &&
            !!tabHeading && (
              <div className="vd-section">
                <span dangerouslySetInnerHTML={{ __html: tabHeading }} />
              </div>
            ))}
        <div
          className={classnames('stocktake-view-list', {
            'stocktake-view-list--with-heading':
              stocktake.isInProgress() && tabHeading,
            'stocktake-view-list--with-differences': this.showDifferenceAndTotals()
          })}
        >
          {!!filteredUnlimitedItems.length && (
            <div className="stocktake-view-list-container">
              <div className="stocktake-view-list-header">
                <table className="table">
                  <tbody>
                    <tr className="table-head table-head--sections">
                      {stocktake.isInProgress() && (
                        <td className="table-cell table-cell--checkbox-fixed" />
                      )}
                      <td className="table-cell table-cell--section table-cell--section-list vd-text-mini-signpost">
                        COUNT LIST
                      </td>
                      <td className="table-cell table-cell--division table-cell--section table-cell--section-count vd-text-mini-signpost">
                        INVENTORY COUNT
                      </td>
                      <td className="table-cell table-cell--division table-cell--section table-cell--section-differences vd-text-mini-signpost">
                        DIFFERENCES
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="stocktake-view-list-body">
                <table className="table">
                  <thead>
                    <tr className="table-head table-head--large">
                      {stocktake.isInProgress() && (
                        <td className="table-cell table-cell--checkbox-fixed table-cell--center-aligned">
                          <RBCheckbox
                            checked={selectedAll}
                            onChange={e => onToggleSelectAll(e.target.checked)}
                          />
                        </td>
                      )}
                      <td className="table-cell table-cell--product clickable">
                        {!!selectedCount ? '' : 'Product'}
                        {!!selectedCount && (
                          <StocktakeReviewActions
                            recountStatus={recountStatus}
                            stocktakeId={stocktakeId}
                            selectedStocktakeItems={selectedStocktakeItems}
                            selectedAll={selectedAll}
                            onResetCount={onResetCount}
                            onMarkItemAsExcluded={onMarkItemAsExcluded}
                          />
                        )}
                      </td>
                      <td className="table-cell table-cell--expected table-cell--right-aligned table-cell--division clickable">
                        Expected
                      </td>
                      <td className="table-cell table-cell--total table-cell--right-aligned clickable">
                        Total
                      </td>
                      {!showCosts && (
                        <td className="table-cell table-cell--unit table-cell--right-aligned table-cell--division table-cell--differences" />
                      )}
                      <td
                        className={classnames(
                          'table-cell table-cell--unit table-cell--right-aligned table-cell--differences clickable',
                          {
                            'table-cell--division': showCosts
                          }
                        )}
                      >
                        Unit
                      </td>
                      {showCosts && (
                        <td className="table-cell table-cell--cost table-cell--right-aligned table-cell--differences clickable">
                          Cost
                        </td>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUnlimitedItems.map((item, i) => (
                      <tr
                        key={i}
                        className={classnames('table-row', {
                          'table-row--even': i % 2 === 0,
                          'table-row--disabled': item.is.excluded,
                          'table-row--unplanned': item.is.unplanned
                        })}
                      >
                        {stocktake.isInProgress() && (
                          <td className="table-cell table-cell--checkbox table-cell--center-aligned">
                            <RBCheckbox
                              checked={item.selected}
                              onChange={e =>
                                onToggleSelect(item, e.target.checked)
                              }
                            />
                          </td>
                        )}
                        <td className="table-cell table-cell--product">
                          {item.excluded && <RBFlag>Excluded</RBFlag>}
                          {item.is.unplanned && (
                            <Tooltip type="info" direction="bottom">
                              {stocktake.isInProgress() && (
                                <p>
                                  This item was not part of your planned count.
                                  If you want to remove it, select the product
                                  and exclude it.
                                </p>
                              )}
                              {!stocktake.isInProgress() && (
                                <p>
                                  This item was not part of your planned count,
                                  but you chose to include it.
                                </p>
                              )}
                            </Tooltip>
                          )}
                          {item.is.unplanned &&
                            !item.is.excluded && (
                              <i className="fa fa-exclamation-triangle vd-text--negative" />
                            )}
                          {item.name}
                          {item.is.processed && (
                            <span>
                              <i className="fa fa-check vd-mls vd-text--success" />&nbsp;
                              {item.is.processed && (
                                <Tooltip type="info" direction="bottom">
                                  Inventory levels for this item have been
                                  updated
                                </Tooltip>
                              )}
                            </span>
                          )}
                          <div className="vd-text-supplementary">
                            {item.sku}
                          </div>
                        </td>
                        <td className="table-cell table-cell--small table-cell--right-aligned table-cell--division">
                          {item.preExpected || ''}
                        </td>
                        <td className="table-cell table-cell--small table-cell--right-aligned">
                          {item.preCounted || ''}
                        </td>
                        {/* Show differences only on All and Unmatched Tabs */}
                        {/* If we don't display product costs, add empty cell so we don't break table layout */}
                        {!showCosts && (
                          <td className="table-cell table-cell--small table-cell--right-aligned table-cell--division table-cell--differences">
                            &nbsp;
                          </td>
                        )}
                        <td
                          className={classnames(
                            'table-cell table-cell--small table-cell--right-aligned table-cell--differences',
                            {
                              'table-cell--division': showCosts
                            }
                          )}
                        >
                          {item.preDifferentCount || ''}
                        </td>
                        {showCosts && (
                          <td className="table-cell table-cell--small table-cell--right-aligned table-cell--differences">
                            {item.preDifferenceCost || ''}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {this.showDifferenceAndTotals() && (
                <StocktakeListTotals
                  classes="stocktake-view-list-totals"
                  stocktake={stocktake}
                  stocktakeItems={stocktakeItems}
                  showCosts={showCosts}
                  isStocktakeInProgress={stocktake.isInProgress()}
                />
              )}
            </div>
          )}
          {stateItems === STATES.success &&
            !filteredUnlimitedItems.length && (
              <div className="vd-section vd-align-center">
                <p>You have no items.</p>
              </div>
            )}
          {stateItems === STATES.error && (
            <div className="vd-section vd-align-center">
              Something has gone wrong... Please try again.
            </div>
          )}
          {stateItems === STATES.inProgress && (
            <div className="vd-section vd-align-center">
              <RBLoader />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default List;
