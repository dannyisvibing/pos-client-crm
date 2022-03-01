import React, { Component } from 'react';
import _ from 'lodash';
import {
  RBSection,
  RBHeader,
  RBLoader,
  RBSectionBack
} from '../../../../rombostrap';
import ManageStocktakeForm from './Form';
import entitiesManager from '../../../../modules/idb/managers/entities-manager';
import getValidRedirectRoute from '../../../../modules/idb/utils/stocktake-route-checker';
import STATES from '../../../../constants/states';

class Manage extends Component {
  state = {
    state: STATES.inProgress
  };

  componentWillMount() {
    this.stocktake = {};
    this.outlets = [];
    this.singleOutlet = false;
    entitiesManager
      .syncAllForInventoryCount()
      .then(() => {
        this.init();
      })
      .catch(error => {
        this.setState({ state: STATES.error });
      });
  }

  init() {
    const { params } = this.props;
    if (params.create) {
      this.initOutlet().then(() => {
        this.setState({ state: STATES.ready });
      });
    } else {
      Promise.all([this.initOutlet(), this.initStocktake()]).then(() => {
        if (!this.redirected) {
          this.setState({ state: STATES.ready });
        }
        this.redirected = false;
      });
    }
  }

  initOutlet() {
    const { myOutlets } = this.props;
    var outletIds,
      outletsManager,
      filteredOutlets = [],
      singleOutlet;
    outletIds = myOutlets.map(outlet => outlet.outletId);
    outletsManager = entitiesManager.getOutletsManager();

    return outletsManager.getAll().then(outlets => {
      var noRestrictedOutletIds = !outletIds || !outletIds.length;

      _.forEach(outlets, outlet => {
        if (
          !outlet.deletedAt &&
          (noRestrictedOutletIds || outletIds.indexOf(outlet.outletId) !== -1)
        ) {
          filteredOutlets.push(outlet);
        }
      });

      singleOutlet = filteredOutlets.length === 1;
      this.outlets = filteredOutlets;
      this.singleOutlet = singleOutlet;
    });
  }

  initStocktake() {
    var stocktakeId = this.props.params.id;
    var stocktakesManager = entitiesManager.getStocktakesManager();

    return stocktakesManager.get(stocktakeId).then(stocktake => {
      var redirectRoute = getValidRedirectRoute(stocktake);
      if (redirectRoute) {
        this.redirected = true;
        this.props.history.replace(redirectRoute);
        return;
      }
      this.stocktake = stocktake;
    });
  }

  render() {
    const { state } = this.state;
    const { params } = this.props;
    return (
      <div>
        <RBSection level={2}>
          <RBHeader category="page">
            <RBSectionBack href="/product/inventory_count" />
            {params.create ? 'Add' : 'Edit'} Inventory Count
          </RBHeader>
        </RBSection>
        {state !== STATES.ready && (
          <div className="vd-section vd-align-center vd-mtxl">
            {state !== STATES.error && <RBLoader />}
            {state === STATES.error && (
              <p>Something has gone wrong... Please try again.</p>
            )}
          </div>
        )}
        {state === STATES.ready && (
          <ManageStocktakeForm
            isCreatePage={params.create}
            singleOutlet={this.singleOutlet}
            stocktake={this.stocktake}
            outlets={this.outlets}
            router={this.props.history}
          />
        )}
      </div>
    );
  }
}

export default Manage;
