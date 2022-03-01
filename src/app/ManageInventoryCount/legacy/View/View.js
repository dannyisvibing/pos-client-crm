import React, { Component } from 'react';
import _ from 'lodash';
import STATES from '../../../../constants/states';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';
import VERSIONED_ENTITIES from '../../../../modules/idb/versioned-entities';
import versionedEntityFetchManager from '../../../../modules/idb/managers/versioned-entity-fetch-manager';
import entitiesManager from '../../../../modules/idb/managers/entities-manager';
import stocktakeRouteChecker from '../../../../modules/idb/utils/stocktake-route-checker';
import stocktakeReportPDF from '../../../../modules/idb/utils/stocktake-report-pdf';
import stocktakeItemsStatusFilter from '../utils/stocktake-items-status-filter';
import CompletedActionBar from './CompletedActionBar';
import StocktakeReviewSummary from './Summary';
import StocktakeReviewList from './List';
import { RBSection, RBBanner, RBLoader } from '../../../../rombostrap';
import StocktakeHeader from '../Shared/Header';
import StocktakeItem from '../../../../modules/idb/model/stocktake-item';

class Review extends Component {
  state = {
    state: STATES.inProgress,
    selectedTab: STOCKTAKE_ITEM_STATUS.uncounted
  };

  componentWillMount() {
    this.stocktakeId = this.props.params.id;
    this.stocktakeItems = [];
    this.filteredUnlimitedItems = [];
    this.itemsForExclusion = [];
    this._loadStocktake();
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

            if (
              !stocktake ||
              (!stocktake.isComplete() && !stocktake.isCancelled())
            ) {
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
    var params = {
      entity: VERSIONED_ENTITIES.consignmentProducts.replace(
        ':id',
        this.stocktakeId
      ),
      apiParams: {
        after: 0
      }
    };

    this._loadAllStocktakeItems(params);
  }

  _loadAllStocktakeItems(params) {
    versionedEntityFetchManager.fetchPage(params).then(response => {
      var version = response.version,
        apiParams = params.apiParams;

      if (response.data.length) {
        this._addItems(response.data);
      }

      if (version.max !== null) {
        apiParams.after = version.max;
        this._loadAllStocktakeItems(params);
      }

      this.setState({ stateItems: STATES.success });
    });
  }

  _addItems(data) {
    var stocktakeItems = this.stocktakeItems;

    _.forEach(data, record => {
      var stocktakeItem = new StocktakeItem(record);

      if (this.stocktake.isComplete() && !stocktakeItem.counted) {
        stocktakeItem.setCount(0);
      }

      stocktakeItem.computeValues();
      stocktakeItems.push(stocktakeItem);
    });

    this.filterStocktakeItems(this.state.selectedTab).then(() => {
      this.setState({ stateItems: STATES.success });
    });
  }

  handleSwitchTab = (e, tab) => {
    this.filterStocktakeItems(tab).then(() => {
      this.setState({ selectedTab: tab });
    });
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

  handleDownloadPDF = e => {
    e.preventDefault();
    stocktakeReportPDF(this.stocktake, this.stocktakeItems);
  };

  render() {
    const { state, stateExclusion, selectedTab } = this.state;
    return (
      <div>
        <RBBanner type="success">
          Inventory Count successfully completed! Your inventory levels may take
          a moment to be updated.
        </RBBanner>
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
            <CompletedActionBar onDownloadPDF={this.handleDownloadPDF} />
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
                  selectedTab={selectedTab}
                  stocktake={this.stocktake}
                  stocktakeItems={this.stocktakeItems}
                  filteredUnlimitedItems={this.filteredUnlimitedItems}
                  selectedStocktakeItems={{}}
                  onToggleSelect={() => {}}
                  onToggleSelectAll={() => {}}
                />
              )}
            </RBSection>
          </div>
        )}
      </div>
    );
  }
}

export default Review;
