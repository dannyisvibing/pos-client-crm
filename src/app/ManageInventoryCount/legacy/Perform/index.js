import React, { Component } from 'react';
import _ from 'lodash';
import StocktakeHeader from '../Shared/Header';
import PerformActionBar from './ActionBar';
import PerformAutocomplete from './Autocomplete';
import StocktakeSummary from './Summary';
import StocktakeItemList from './List';
import CountFeed from './CountFeed';
import STATES from '../../../../constants/states';
import TIMINGS from '../../../../constants/stocktake/timing';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';
import entitiesManager from '../../../../modules/idb/managers/entities-manager';
import stocktakeRouteChecker from '../../../../modules/idb/utils/stocktake-route-checker';
import stocktakeResource from '../api/stocktake';
import stocktakeItemCountedFilter from '../utils/stocktake-item-counted-filter';
import StocktakeItem from '../../../../modules/idb/model/stocktake-item';
import Product from '../../../../modules/idb/model/product';
import StocktakeCount from '../../../../modules/idb/model/stocktake-count';
import { RBSection, RBLoader } from '../../../../rombostrap';
import Stocktake from '../../../../modules/idb/model/stocktake';

class Perform extends Component {
  state = {
    state: STATES.inProgress,
    stateProducts: STATES.success,
    stateSaving: STATES.success,
    onlineStatus: true,
    showFailed: false,
    failed: 0,
    lastSaved: null,
    selectedTab: STOCKTAKE_ITEM_STATUS.any
  };

  componentWillMount() {
    this._syncStocktakeItems = this._syncStocktakeItems.bind(this);
    this._initPollStocktake = this._initPollStocktake.bind(this);
    this.stocktakeId = this.props.params.id;
    this.stocktakeItems = [];
    this.filteredStocktakeItems = [];
    this.stocktakeItemsManager = entitiesManager.getStocktakeItemsManager();
    this._loadStocktake();
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearInterval(this._syncStocktakeItemsHandler);
  }

  countProduct(product, quantity, logCountFeed) {
    var stocktakeItem;

    logCountFeed = typeof logCountFeed === 'undefined' ? true : false;

    if (!this._autoSavePromise) {
      this._autoSavePromise = setTimeout(() => {
        this._autoSaveStocktakeItems();
      }, TIMINGS.autoSave);
    }

    stocktakeItem = new StocktakeItem({
      stocktakeId: this.stocktakeId,
      productId: product.id,
      countedUnsync: quantity
    });

    if (logCountFeed) {
      this.countFeedRef.addFeedCount(
        new StocktakeCount({
          stocktakeId: this.stocktakeId,
          productId: product.id,
          name: product.getName(),
          highlight: true,
          quantity: quantity
        })
      );
    }

    stocktakeItem.resetUpdatedDate();

    this._addItem(stocktakeItem, true);
    this._setVisibleItemsProduct(this.state.selectedTab).then(() => {
      this.setState({ state: STATES.success });
    });
  }

  _loadStocktake() {
    entitiesManager
      .syncAllForInventoryCount()
      .then(() => {
        var stocktakesManager = entitiesManager.getStocktakesManager();

        return stocktakesManager.get(this.stocktakeId).then(stocktake => {
          this.stocktake = stocktake;
          if (stocktake && stocktake.isInProgress()) {
            this.setState({
              state: STATES.success,
              onlineStatus: true
            });
            this._loadProducts();
            this._initPollStocktake();
          } else {
            var redirectRoute = stocktakeRouteChecker(stocktake);
            if (redirectRoute) {
              this.props.history.replace(redirectRoute);
              return;
            }
            this.setState({ state: STATES.error });
          }
        });
      })
      .catch(error => {
        this.setState({
          state: STATES.error,
          stateItems: STATES.error
        });
      });
  }

  _loadProducts() {
    // this.setState({stateProducts: STATES.inProgress});

    this.setState({ stateItems: STATES.inProgress });
    this._loadStocktakeItems().then(() => {
      this._syncStocktakeItems();
      this._syncStocktakeItemsHandler = setInterval(
        this._syncStocktakeItems,
        TIMINGS.itemsPolling
      );
    });
  }

  _loadStocktakeItems() {
    if (this._loadStocktakeItemsPromise) {
      return this._loadStocktakeItemsPromise;
    }

    this._loadStocktakeItemsPromise = this.stocktakeItemsManager
      .getAll(this.stocktakeId)
      .then(stocktakeItems => {
        console.log('ffff', stocktakeItems);
        this._addItemsSynced(stocktakeItems);
        this._autoSaveStocktakeItems();
        this._loadStocktakeItemsPromise = null;
      });

    return this._loadStocktakeItemsPromise;
  }

  _syncStocktakeItems() {
    var stocktake = this.stocktake;
    this.stocktakeItemsManager
      .sync(this.stocktakeId, stocktakeItems => {
        if (!stocktakeItems.length && stocktake.isInProgressProcessing()) {
          this._updateStocktakeFromApi();
        }

        this._addItemsSynced(stocktakeItems);
      })
      .then(() => {
        // If app was offline, try to save as app is now online
        if (!this.state.onlineStatus) {
          this._autoSaveStocktakeItems();
          this.setState({ onlineStatus: true });
        }

        if (stocktake.isInProgressProcessing()) {
          this._updateStocktakeFromApi();
        }
      });
  }

  _initPollStocktake() {
    if (this.stocktake.isInProgressProcessing()) {
      this._updateStocktakeFromApi();
      this._pollStocktakePromise = setInterval(
        this._initPollStocktake,
        TIMINGS.performPolling
      );
    }
  }

  _addItemsSynced(stocktakeItems) {
    _.forEach(stocktakeItems, stocktakeItem => {
      this._addItem(stocktakeItem);
    });

    this._setVisibleItemsProduct(this.state.selectedTab).then(() => {
      this.setState({ stateItems: STATES.success });
    });
  }

  _addItem(stocktakeItem, persistInStore) {
    var stocktakeItems = this.stocktakeItems,
      stocktake = this.stocktake,
      itemKey = this._getExistingItemKey(stocktakeItem.productId),
      existingStocktakeItem;

    if (itemKey > -1) {
      existingStocktakeItem = stocktakeItems[itemKey];

      if (stocktakeItem.counted) {
        existingStocktakeItem.setCount(stocktakeItem.counted);
      }

      if (stocktakeItem.countedUnsync) {
        existingStocktakeItem.addCountUnsync(stocktakeItem.getCountedUnsync());

        stocktakeItem.setCountUnsynced(
          existingStocktakeItem.getCountedUnsync()
        );
        stocktakeItem.setCount(existingStocktakeItem.getCounted);
      }

      if (stocktake.updatedAt !== existingStocktakeItem.updatedAt) {
        existingStocktakeItem.updatedAt = stocktakeItem.updatedAt;
      }

      if (!existingStocktakeItem.expected && stocktakeItem.expected) {
        existingStocktakeItem.setExpected(stocktakeItem.expected);
      }

      if (!stocktake.isPartial()) {
        existingStocktakeItem.planned = true;
      } else if (typeof existingStocktakeItem.planned === 'undefined') {
        existingStocktakeItem.planned = stocktakeItem.planned;
      }

      existingStocktakeItem.computeValues();
    } else {
      if (!stocktake.isPartial()) {
        stocktakeItem.planned = true;
      }

      stocktakeItem.computeValues();
      stocktakeItems.push(stocktakeItem);
    }

    if (persistInStore) {
      this.stocktakeItemsManager.insert(stocktakeItem);
    }
  }

  _setVisibleItemsProduct(selectedTab) {
    this.filteredStocktakeItems = stocktakeItemCountedFilter(
      this.stocktakeItems,
      selectedTab
    );
    var needLoadProducts = _.some(
      this.filteredStocktakeItems,
      item => !item.name
    );
    if (needLoadProducts) {
      return this.stocktakeItemsManager.setProducts(
        this.filteredStocktakeItems
      );
    }
    return Promise.resolve();
  }

  _getExistingItemKey(productId) {
    return _.findIndex(this.stocktakeItems, { productId });
  }

  _autoSaveStocktakeItems() {
    return this.stocktakeItemsManager
      .pushCounts(this.stocktakeId, this.stocktakeItems)
      .then(promises => {
        var failed = 0,
          saved;

        if (!this.unmounted) {
          this.setState({ showFailed: false });
        }
        saved = _.some(promises, promise => !!promise);

        _.forEach(promises, promise => {
          failed += promise === false ? 1 : 0;
        });

        // If any item failed and it's the first try, try to save again
        if (failed && !this.trySaveAgain) {
          this.trySaveAgain = true;
          setTimeout(() => {
            this._autoSaveStocktakeItems().then(() => {
              this.trySaveAgain = false;
              if (!this.unmounted) {
                this.setState({
                  showFailed: true,
                  failed: failed,
                  lastSaved: new Date()
                });
              }
              this._autoSavePromise = null;
            });
          }, TIMINGS.retrySave);
        } else if (saved) {
          if (!this.unmounted) {
            this.setState({ lastSaved: new Date() });
          }
          this._autoSavePromise = null;
        }

        if (saved && !this.unmounted) {
          this.setState({ onlineStatus: true });
        }
      });
  }

  _updateStocktakeFromApi() {
    return stocktakeResource.get(this.stocktakeId).then(stocktake => {
      this.stocktake = new Stocktake(stocktake);
    });
  }

  saveCounts() {
    this.setState({
      stateSaving: STATES.inProgress,
      state: STATES.inProgress,
      stateItems: STATES.success
    });

    return this.stocktakeItemsManager
      .pushCounts(this.stocktakeId, this.stocktakeItems)
      .then(() => {
        this.setState({ stateSaving: STATES.success });
      });
  }

  handleAddItemFromAutocomplete = (product, qty) => {
    this.countProduct(product, qty);
  };

  handleAddItemFromList = (e, stocktakeItem) => {
    var product;

    product = new Product({
      id: stocktakeItem.productId,
      name: stocktakeItem.name
    });

    this.perAutocompleteRef.selectProduct(product);
  };

  handleSelectTab = (e, tab) => {
    this._setVisibleItemsProduct(tab).then(() => {
      this.setState({ selectedTab: tab });
    });
  };

  handlePause = e => {
    e.preventDefault();

    this.saveCounts().then(() => {
      this.props.history.push('/product/inventory_count');
    });
  };

  handleReview = e => {
    e.preventDefault();

    this.saveCounts().then(() => {
      this.props.history.push(
        '/product/inventory_count/review/' + this.stocktakeId
      );
    });
  };

  render() {
    const {
      state,
      stateProducts,
      stateItems,
      stateSaving,
      selectedTab,
      onlineStatus,
      lastSaved,
      showFailed,
      failed
    } = this.state;
    return (
      <div>
        <div className="perform-page-container">
          <RBSection>
            {state === STATES.error && (
              <div className="vd-align-center vd-mtxl">
                <p>Something has gone wrong... Please try again.</p>
              </div>
            )}
            {state === STATES.inProgress && <RBLoader />}
            {state === STATES.success && (
              <StocktakeHeader stocktake={this.stocktake} />
            )}
          </RBSection>
          {stateProducts === STATES.success && (
            <PerformActionBar
              onlineStatus={onlineStatus}
              lastSaved={lastSaved}
              stateSaving={stateSaving}
              showFailed={showFailed}
              failed={failed}
              onPause={this.handlePause}
              onReview={this.handleReview}
            />
          )}
          {stateProducts === STATES.success && (
            <RBSection type="tertiary">
              <PerformAutocomplete
                ref={c => (this.perAutocompleteRef = c)}
                stocktake={this.stocktake}
                onAddItem={this.handleAddItemFromAutocomplete}
              />
            </RBSection>
          )}
          {stateProducts === STATES.error && (
            <div className="vd-section vd-align-center">
              <p>Something has gone wrong... Please try again.</p>
            </div>
          )}
          {state === STATES.success && (
            <RBSection>
              <StocktakeSummary
                selectedTab={selectedTab}
                stocktakeItems={this.stocktakeItems}
                onSwitchTab={this.handleSelectTab}
              />
              <StocktakeItemList
                stocktake={this.stocktake}
                stateProducts={stateProducts}
                stateItems={stateItems}
                selectedTab={selectedTab}
                filteredStocktakeItems={this.filteredStocktakeItems}
                onSelectProductFromList={this.handleAddItemFromList}
              />
            </RBSection>
          )}
        </div>
        <CountFeed
          ref={c => (this.countFeedRef = c)}
          stocktakeId={this.stocktakeId}
          onUndoCount={(product, qty) => this.countProduct(product, qty, false)}
        />
      </div>
    );
  }
}

export default Perform;
