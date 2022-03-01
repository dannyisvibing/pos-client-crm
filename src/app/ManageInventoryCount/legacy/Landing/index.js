import React, { Component } from 'react';
import _ from 'lodash';
import { RBSection, RBHeader, RBFlex, RBButton } from '../../../../rombostrap';
import Summary from './Summary';
import NoAccess from './NoAccess';
import StocktakeList from './List';
import STATES from '../../../../constants/states';
import TIMING from '../../../../constants/stocktake/timing';
import STOCKTAKE_STATUS from '../../../../constants/stocktake/status';
import entitiesManager from '../../../../modules/idb/managers/entities-manager';
import stocktakeListFilter from '../utils/stocktake-list';
import stocktakeResource from '../api/stocktake';

class Landing extends Component {
  state = {
    state: STATES.nextPage,
    selectedTab: STOCKTAKE_STATUS.due,
    selectedAll: false,
    listHasActions: false
  };

  componentWillMount() {
    const { myOutlets } = this.props;
    this.restrictedOutletIds = myOutlets.map(outlet => outlet.outletId);
    this.outlets = [];
    this.stocktakes = [];
    this.filteredStocktakes = [];
    this.selectedStocktakes = {};
    this.deletableStocktakes = null;
    this.deletedArr = [];
    this.erroredArr = [];
    this.setState({ listHasActions: this._getListHasActions() });

    entitiesManager
      .syncAllForInventoryCount()
      .then(() => {
        Promise.all([this.initOutlets(), this.initStocktakes()]).then(() => {
          this.filterStocktakes(this.state.selectedTab);
          this.setState({ state: STATES.ready });
        });
      })
      .catch(err => {
        this.setState({ state: STATES.error });
      });
  }

  _getListHasActions() {
    var status = this.state.selectedTab;
    return !(
      status === STOCKTAKE_STATUS.completed ||
      status === STOCKTAKE_STATUS.cancelled
    );
  }

  resetSelection() {
    _.forEach(this.selectedStocktakes, function(stocktake) {
      stocktake.selected = false;
    });
    this.deletableStocktakes = null;
    this.selectedStocktakes = {};
    this.setState({ selectedAll: false });
  }

  resetList() {
    this.setState({ listHasActions: this._getListHasActions() });
    this.resetSelection();
  }

  initStocktakes() {
    var stocktakesManager = entitiesManager.getStocktakesManager();
    return stocktakesManager.getAll().then(stocktakes => {
      this.stocktakes = stocktakes;
    });
  }

  initOutlets() {
    var outletsManager = entitiesManager.getOutletsManager();
    return outletsManager.getAll().then(outlets => {
      this.outlets = outlets;
    });
  }

  filterStocktakes(tab) {
    this.filteredStocktakes = stocktakeListFilter(
      this.stocktakes,
      tab,
      this.restrictedOutletIds
    );
    this.deletableStocktakes = _.filter(this.filteredStocktakes, function(
      stocktake
    ) {
      return stocktake.isDeletable();
    });
  }

  _deleteAction(selectedStocktakesArr) {
    var stocktakeToDelete;

    if (!selectedStocktakesArr.length) {
      this._deleteActionSuccess();
    } else {
      stocktakeToDelete = selectedStocktakesArr.pop();

      stocktakeResource
        .delete(stocktakeToDelete.id)
        .then(() => {
          this.deletedArr.push(stocktakeToDelete);
          setTimeout(() => {
            this._deleteAction(selectedStocktakesArr);
          }, TIMING.deleteDelay);
        })
        .catch(error => {
          if (error.status === 404) {
            this.deletedArr.push(stocktakeToDelete);
          } else {
            this.erroredArr.push(stocktakeToDelete);
          }

          setTimeout(() => {
            this._deleteAction(selectedStocktakesArr);
          }, TIMING.deleteDelay);
        });
    }
  }

  _deleteActionSuccess() {
    // var successMsg;

    if (this.deletedArr.length) {
      // successMsg = (this.deletedArr.length > 1) ? MESSAGES.delete.successes : MESSAGES.delete.success;
      // To Do - Display notification
    }

    this._updateDeletedStocktakes(this.deletedArr);

    this.deletedArr = [];
    this.erroredArr = [];
    this.resetSelection();
    this.filterStocktakes(this.state.selectedTab);
    this.setState({ state: STATES.ready });
  }

  _updateDeletedStocktakes(deletedStocktakes) {
    _.forEach(deletedStocktakes, deletedStocktake => {
      var itemKey = _.findIndex(this.stocktakes, {
        id: deletedStocktake.id
      });

      this.stocktakes.splice(itemKey, 1);
    });
  }

  handleSwitchList = (e, tab) => {
    if (this.state.selectedTab !== tab) {
      this.filterStocktakes(tab);
      this.setState({ selectedTab: tab });
      this.resetList();
    }
  };

  handleGoto = (e, stocktake) => {
    e.preventDefault();
    var url = stocktake.getUrl();
    this.props.history.push(url);
  };

  handleToggleSelect = (stocktake, checked) => {
    if (checked) {
      this.selectedStocktakes[stocktake.id] = stocktake;
    } else {
      delete this.selectedStocktakes[stocktake.id];
    }

    this.setState({
      selectedAll:
        _.size(this.selectedStocktakes) === _.size(this.deletableStocktakes)
    });
  };

  handleToggleSelectAll = checked => {
    _.forEach(this.deletableStocktakes, stocktake => {
      stocktake.selected = checked;
      if (checked) {
        this.selectedStocktakes[stocktake.id] = stocktake;
      } else {
        delete this.selectedStocktakes[stocktake.id];
      }
    });

    this.setState({ selectedAll: checked });
  };

  handleDeleteStocktakes = e => {
    e.preventDefault();
    this.setState({ state: STATES.inProgress });
    this._deleteAction(_.values(this.selectedStocktakes));
  };

  render() {
    const { state, selectedTab, selectedAll, listHasActions } = this.state;
    return window.noAccess ? (
      <NoAccess />
    ) : (
      <div>
        <RBSection>
          <RBHeader category="page">Inventory Count</RBHeader>
        </RBSection>
        <RBSection classes="vd-pbn vd-ptn">
          <Summary
            restrictedOutletIds={this.restrictedOutletIds}
            selectedTab={selectedTab}
            stocktakes={this.stocktakes}
            onSwitchList={this.handleSwitchList}
          />
        </RBSection>
        <RBSection type="secondary">
          <RBFlex flex flexJustify="between" flexAlign="center">
            <div className="action-bar-description">
              Create, schedule and complete counts to keep track of your
              inventory.
            </div>
            <RBButton category="primary" href="/product/inventory_count/create">
              Add Inventory Count
            </RBButton>
          </RBFlex>
        </RBSection>
        <RBSection>
          <StocktakeList
            state={state}
            outlets={this.outlets}
            selectedTab={selectedTab}
            selectedAll={selectedAll}
            selectedStocktakes={this.selectedStocktakes}
            filteredStocktakes={this.filteredStocktakes}
            deletableStocktakes={this.deletableStocktakes}
            listHasActions={listHasActions}
            onGoto={this.handleGoto}
            onToggleSelect={this.handleToggleSelect}
            onToggleSelectAll={this.handleToggleSelectAll}
            onDeleteStocktakes={this.handleDeleteStocktakes}
          />
        </RBSection>
      </div>
    );
  }
}

export default Landing;
