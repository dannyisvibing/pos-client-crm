import React, { Component } from 'react';
import _ from 'lodash';

import STATES from '../../../../constants/states';
import TIMING from '../../../../constants/stocktake/timing';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';
import API_STOCKTAKE_STATUS from '../../../../constants/stocktake/api-status';
import entitiesManager from '../../../../modules/idb/managers/entities-manager';
import stocktakeRouteChecker from '../../../../modules/idb/utils/stocktake-route-checker';
import stocktakeResource from '../api/stocktake';
import stocktakeItemsStatusFilter from '../utils/stocktake-items-status-filter';
import stocktakeItemResource from '../api';
import StocktakeCount from '../../../../modules/idb/model/stocktake-count';
import { RBSection, RBLoader } from '../../../../rombostrap';
import StocktakeHeader from '../Shared/Header';
import ReviewActionBar from './ReviewActionBar';
import StocktakeReviewSummary from './Summary';
import StocktakeReviewList from './List';

class Review extends Component {
  state = {
    state: STATES.inProgress,
    selectedTab: STOCKTAKE_ITEM_STATUS.uncounted
  };

  componentWillMount() {
    this._addItem = this._addItem.bind(this);
    this._initPollStocktake = this._initPollStocktake.bind(this);
    this._syncStocktakeItems = this._syncStocktakeItems.bind(this);

    this.stocktakeId = this.props.params.id;
    this.stocktakeItems = [];
    this.filteredUnlimitedItems = [];
    this.selectedStocktakeItems = {};
    this.itemsForExclusion = [];
    this._loadStocktake();
  }

  componentWillUnmount() {
    clearInterval(this._syncStocktakeItemsPromise);
  }

  _loadStocktake() {
    entitiesManager
      .syncAllForInventoryCount()
      .then(() => {
        var stocktakesManager = entitiesManager.getStocktakesManager();

        stocktakesManager
          .get(this.stocktakeId)
          .then(stocktake => {
            this.stocktake = stocktake;

            if (!stocktake || !stocktake.isInProgress()) {
              // If it's not in progress, shouldn't access this page.
              this.setState({ state: STATES.error });
              var redirectRoute = stocktakeRouteChecker(stocktake);
              if (redirectRoute) {
                this.props.history.replace(redirectRoute);
              }
            } else {
              this.setState({
                state: STATES.success,
                stateItems: STATES.inProgress
              });
              this._loadStocktakeItems();

              // Poll stocktake until status is progress processed
              if (stocktake.isInProgressProcessing()) {
                setTimeout(this._initPollStocktake, TIMING.reviewPolling);
              }
            }
          })
          .catch(error => {
            this.setState({
              state: STATES.error,
              stateItems: STATES.error
            });
          });
      })
      .catch(error => {
        this.setState({ state: STATES.error });
      });
  }

  _loadStocktakeItems() {
    this.stocktakeItemsManager = entitiesManager.getStocktakeItemsManager();
    this.stocktakeItemsManager.getAll(this.stocktakeId).then(stocktakeItems => {
      this._addItemsSynced(stocktakeItems);
      this._syncStocktakeItemsPromise = setInterval(
        this._syncStocktakeItems,
        TIMING.itemsPolling
      );
    });
  }

  _initPollStocktake() {
    stocktakeResource.get(this.stocktakeId).then(stocktake => {
      this.stocktake = stocktake;
      if (stocktake.isInProgressProcessing()) {
        setTimeout(this._initPollStocktake, TIMING.reviewPolling);
      }
    });
  }

  _addItemsSynced(stocktakeItems) {
    _.map(stocktakeItems, this._addItem);
    this.filterStocktakeItems(this.state.selectedTab).then(() => {
      this.setState({ stateItems: STATES.success });
    });
  }

  _syncStocktakeItems() {
    if (this._activeSync) return;
    this._activeSync = true;
    this.stocktakeItemsManager
      .sync(this.stocktakeId, stocktakeItems => {
        if (stocktakeItems.length) {
          this._addItemsSynced(stocktakeItems);
        }
      })
      .then(() => {
        this._activeSync = false;
      });
  }

  _addItem(stocktakeItem) {
    var stocktakeItems = this.stocktakeItems,
      itemKey;

    itemKey = _.findIndex(stocktakeItems, {
      productId: stocktakeItem.productId
    });

    if (itemKey > -1) {
      stocktakeItems[itemKey].setCount(stocktakeItem.getCounted());
      stocktakeItems[itemKey].computeValues();
    } else {
      stocktakeItem.computeValues();
      stocktakeItems.push(stocktakeItem);
    }
  }

  _excludeItems() {
    var itemToExclude, itemKey;

    if (this.itemsForExclusion.length) {
      itemToExclude = this.itemsForExclusion.pop();
      itemKey = _.findKey(this.stocktakeItems, {
        productId: itemToExclude.productId
      });

      stocktakeItemResource
        .delete(this.stocktakeId, itemToExclude.productId)
        .then(() => {
          this.stocktakeItems.splice(itemKey, 1);
          setTimeout(() => {
            this._excludeItems();
          }, TIMING.deleteDelay);
        })
        .catch(() => {
          // To Do - handle retry
        });
    } else {
      this._finishCompleteAction();
    }
  }

  _finishCompleteAction() {
    this.setState({ state: STATES.success });
    this._completeStocktake();
  }

  _completeStocktake() {
    // var message = MESSAGES.view.complete;
    var params = {
      status: API_STOCKTAKE_STATUS.completed
    };

    stocktakeResource.update(params, this.stocktakeId).then(() => {
      this._cleanDatabase();
      this.props.history.replace(
        '/product/inventory_count/view' + this.stocktakeId
      );
    });
  }

  _cleanDatabase() {
    this.stocktakeCountsManager = entitiesManager.getStocktakeCountsManager();
    return Promise.all([
      this.stocktakeItemsManager.deleteAll(this.stocktakeId),
      this.stocktakeCountsManager.deleteAll(this.stocktakeId)
    ]);
  }

  _getRecountableItems() {
    return _.filter(this.selectedStocktakeItems, stocktakeItem => {
      return (
        stocktakeItem.counted !== null &&
        !stocktakeItem.isZeroCounted() &&
        !stocktakeItem.excluded
      );
    });
  }

  _resetCount() {
    this.stocktakeCountsManager = entitiesManager.getStocktakeCountsManager();
    var recountableItems = this._getRecountableItems(),
      decimal = 0.001;

    this.setState({ recountStatus: STATES.inProgress });

    _.forEach(recountableItems, stocktakeItem => {
      var quantity = stocktakeItem.resetCount();

      stocktakeItem.computeValues();
      this.stocktakeItemsManager.insert(stocktakeItem);
      this.stocktakeCountsManager.insert(
        this.stocktakeId,
        new StocktakeCount({
          order: new Date().getTime() + decimal,
          stocktakeId: this.stocktakeId,
          productId: stocktakeItem.productId,
          name: stocktakeItem.name,
          quantity: quantity
        })
      );

      decimal += decimal;
    });

    this.stocktakeItemsManager
      .pushCounts(this.stocktakeId, recountableItems)
      .then(() => {
        this.setState({ recountStatus: STATES.success });
      })
      .catch(error => {
        this.setState({ recountStatus: STATES.error });
      });
  }

  resetSelection() {
    _.forEach(this.selectedStocktakeItems, stocktakeItem => {
      stocktakeItem.selected = false;
    });

    this.selectedStocktakeItems = {};
    this.setState({ selectedAll: false });
  }

  handleSwitchTab = (e, tab) => {
    this.filterStocktakeItems(tab).then(() => {
      this.setState({ selectedTab: tab });
    });

    this.resetSelection();
  };

  filterStocktakeItems(tab) {
    this.filteredUnlimitedItems = stocktakeItemsStatusFilter(
      this.stocktakeItems,
      tab
    );
    var needLoadProducts = _.some(
      this.filteredUnlimitedItems,
      item => !item.name
    );
    if (needLoadProducts) {
      return this.stocktakeItemsManager.setProducts(
        this.filteredUnlimitedItems
      );
    }
    return Promise.resolve();
  }

  handleToggleSelectAll = checked => {
    _.forEach(this.filteredUnlimitedItems, stocktakeItem => {
      stocktakeItem.selected = checked;

      if (checked) {
        this.selectedStocktakeItems[stocktakeItem.productId] = stocktakeItem;
      } else {
        delete this.selectedStocktakeItems[stocktakeItem.productId];
      }
    });

    this.setState({ selectedAll: checked });
  };

  handleToggleSelect = (stocktakeItem, checked) => {
    stocktakeItem.selected = checked;
    if (stocktakeItem.selected) {
      this.selectedStocktakeItems[stocktakeItem.productId] = stocktakeItem;
    } else {
      delete this.selectedStocktakeItems[stocktakeItem.productId];
    }

    this.setState({
      selectedAll:
        _.size(this.selectedStocktakeItems) ===
        this.filteredUnlimitedItems.length
    });
  };

  handleAbandon = () => {
    // var abandon = MESSAGES.view.abandon;
    var params = {
      status: API_STOCKTAKE_STATUS.cancelled
    };

    stocktakeResource.update(params, this.stocktakeId).then(() => {
      this._cleanDatabase();
      this.props.history.replace('/product/inventory_count');
    });
  };

  handleStartCompleteAction = () => {
    this.itemsForExclusion = _.filter(this.stocktakeItems, {
      excluded: true
    });
    clearInterval(this._syncStocktakeItemsPromise);
    this._excludeItems();
    this.setState({ stateExclusion: STATES.inProgress });
  };

  handleResetCount = () => {
    this._resetCount();
    this.resetSelection();
  };

  handleMarkItemsAsExcluded = (e, excluded) => {
    e.preventDefault();

    var excludedItems = {};

    _.forEach(this.selectedStocktakeItems, stocktakeItem => {
      stocktakeItem.excluded = excluded;
      stocktakeItem.selected = false;
      excludedItems[stocktakeItem.id] = stocktakeItem;
    });
    this.stocktakeItemsManager._getStore().batch(excludedItems);
    this.resetSelection();
  };

  handleResume = e => {
    e.preventDefault();
    this.props.history.push(
      '/product/inventory_count/perform/' + this.stocktakeId
    );
  };

  render() {
    const {
      state,
      stateItems,
      stateExclusion,
      selectedTab,
      selectedAll
    } = this.state;
    return (
      <div>
        {state === STATES.success && (
          <RBSection level={2}>
            {state === STATES.error && (
              <div className="vd-section vd-align-center">
                <p>Something has gone wrong... Please try again.</p>
              </div>
            )}
            <StocktakeHeader stocktake={this.stocktake} />
          </RBSection>
        )}
        {state === STATES.inProgress && (
          <div className="vd-section vd-align-center vd-mtxl">
            <RBLoader />
          </div>
        )}
        {state === STATES.success && (
          <div>
            {!this.itemsForExclusion.length && (
              <ReviewActionBar
                stocktakeId={this.stocktakeId}
                stocktake={this.stocktake}
                stocktakeItems={this.stocktakeItems}
                stateItems={stateItems}
                onAbandon={this.handleAbandon}
                onStartCompleteAction={this.handleStartCompleteAction}
                onResume={this.handleResume}
              />
            )}
            <RBSection>
              {stateExclusion !== STATES.inProgress && (
                <StocktakeReviewSummary
                  selectedTab={selectedTab}
                  stocktake={this.stocktake}
                  stocktakeItems={this.stocktakeItems}
                  onSwitchTab={this.handleSwitchTab}
                />
              )}
              {stateExclusion !== STATES.inProgress && (
                <StocktakeReviewList
                  stateItems={this.state.stateItems}
                  recountStatus={this.state.recountStatus}
                  selectedTab={selectedTab}
                  selectedAll={selectedAll}
                  stocktakeId={this.stocktakeId}
                  stocktake={this.stocktake}
                  stocktakeItems={this.stocktakeItems}
                  filteredUnlimitedItems={this.filteredUnlimitedItems}
                  selectedStocktakeItems={this.selectedStocktakeItems}
                  onToggleSelect={this.handleToggleSelect}
                  onToggleSelectAll={this.handleToggleSelectAll}
                  onResetCount={this.handleResetCount}
                  onMarkItemAsExcluded={this.handleMarkItemsAsExcluded}
                />
              )}
            </RBSection>

            {stateExclusion === STATES.inProgress && (
              <div className="vd-section vd-align-center">
                {!!this.itemsForExclusion.length && (
                  <p>Excluding items, {this.itemsForExclusion.length} left</p>
                )}
                <RBLoader />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Review;
