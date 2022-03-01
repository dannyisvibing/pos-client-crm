import React, { Component } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import STORES from '../../../../modules/idb/stores';
import storeManager from '../../../../modules/idb/managers/store-manager';
import { RBHeader, RBButton, RBSectionBack } from '../../../../rombostrap';
import StocktakeFilters from './Filters';

class Header extends Component {
  state = {
    showDetails: false
  };

  componentWillMount() {
    const { stocktake } = this.props;
    this.outlet = {};
    var outletsStore = storeManager.getStore(STORES.outlets);

    outletsStore.get(stocktake.outletId).then(outlet => {
      this.outlet = outlet || {};
    });
  }

  handleShowDetails = e => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  render() {
    const stocktake = this.props.stocktake;
    const { showDetails } = this.state;
    return (
      <div>
        <RBHeader category="page">
          <RBSectionBack href="/product/inventory_count" />
          {stocktake.name}
          <RBButton
            modifiers={['inline']}
            classes="vd-button--text vd-mlm"
            onClick={this.handleShowDetails}
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </RBButton>
        </RBHeader>
        {showDetails && (
          <div
            className={classnames('vd-mtm', {
              'vd-mbl': stocktake.isPartial()
            })}
          >
            <div className="vd-g-row vd-g-s-up-1 vd-g-m-up-3 vd-g-l-up-3">
              <div className="vd-g-col">
                <i className="fa fa-calendar vd-mrm vd-text--secondary" />Start:{' '}
                {moment(stocktake.createdAt).format('MMM DD, YYYY h:m:s A')}
              </div>
              <div className="vd-g-col">
                <i
                  className="fa fa-map-marker vd-mrm vd-text--secondary"
                  style={{ fontSize: '18px' }}
                />
                {this.outlet.outletName}
              </div>
            </div>
            {stocktake.isComplete() && (
              <div className="vd-mtm">
                <div className="vd-g-row vd-g-s-up-1 vd-g-m-up-3 vd-g-l-up-3">
                  <div className="vd-g-col">
                    <i className="fa fa-calendar vd-mrm vd-text--secondary" />End:{' '}
                    {moment(stocktake.receivedAt).format(
                      'MMM DD, YYYY h:m:s A'
                    )}
                  </div>
                  <div className="vd-g-col">
                    <i className="fa fa-clock-o vd-mrm vd-text--secondary" />Duration:{' '}
                    {stocktake.getDuration()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {stocktake.isPartial() && (
          <div className="vd-mtm">
            <StocktakeFilters stocktake={stocktake} />
          </div>
        )}
      </div>
    );
  }
}

export default Header;
