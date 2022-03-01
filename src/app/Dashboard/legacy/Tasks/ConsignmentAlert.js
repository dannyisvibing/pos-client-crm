import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { RBLink } from '../../../../rombostrap';
import {
  CONSIGNMENT_TYPES,
  CONSIGNMENT_STATUSES
} from '../../../../constants/consignment';
import { getStartOfTimeUnit } from '../../utils/periodUtils';
import filterRestrictedOutlet from '../../utils/restrictedOutletFilter';
import ContextAwareComponent from '../ContextAwareComponent';
import { CardState } from '../../managers/card/card.model';
import { activeUserSelector } from '../../../../modules/user';
import request from '../../../../utils/http';

const CARD_TITLES = {
  [CONSIGNMENT_TYPES.supplier]: 'Supplier Order',
  [CONSIGNMENT_TYPES.outlet]: 'Transfer',
  [CONSIGNMENT_TYPES.stocktake]: 'Count'
};

class ConsignmentAlert extends ContextAwareComponent {
  state = {
    title: ''
  };

  componentWillMount() {
    super.componentWillMount();
    this.consignmentData = [];
    this.setState({
      title: CARD_TITLES[this.props.type],
      state: this.props.task.getState()
    });
    this.loadData();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  onPeriodChange() {
    this.loadData();
  }

  onOutletChange() {
    this.loadData();
  }

  generateConsignmentLink() {
    const { type } = this.props;
    const isStocktake = type === CONSIGNMENT_TYPES.stocktake;

    // If only one consignment in filtered data, link directly to the page
    if (this.consignmentData.length === 1) {
      const consignmentId = this.consignmentData[0].id;
      return isStocktake
        ? `/product/inventory_count/${consignmentId}/edit`
        : `/consignment/${consignmentId}`;
    }

    if (isStocktake) {
      return `/product/inventory_count`;
    }

    return `/product/consignment?filter=${CONSIGNMENT_STATUSES.sent}`;
  }

  loadData() {
    const { task, type, activeUser } = this.props;
    const outletId = this.outlet && this.outlet.outletId;
    var endOfPeriod = moment().endOf(getStartOfTimeUnit(this.period));
    task.setState(CardState.Loading);
    request({
      url: '/dashboard/consignments-of-task',
      params: { type, outletId, endOfPeriod }
    })
      .then(response => response.data)
      .then(data => {
        return filterRestrictedOutlet(
          data,
          activeUser.restrictedOutletIds,
          'outletId'
        );
      })
      .then(data => {
        this.consignmentData = data;
        this._toggleTaskDisplay();
      });
  }

  _toggleTaskDisplay() {
    var newState;
    const { task } = this.props;
    var hasData = this.consignmentData.length > 0;
    newState = hasData ? CardState.Ready : CardState.Hidden;
    task.setState(newState);
    this.setState({ state: newState });
  }

  render() {
    const { type } = this.props;
    const { state, title } = this.state;
    return state === CardState.Ready ? (
      <div>
        <h2 className="vd-man">
          <span className="ds-card-header ds-consignment-task-header">
            {title}
          </span>
        </h2>
        <div className="ds-card-content">
          {type === 'supplierOrder' && (
            <span>
              You have {this.consignmentData.length} order{this.consignmentData
                .length === 1
                ? ''
                : 's'}{' '}
              waiting to be received
            </span>
          )}
          {type === 'outletTransfer' && (
            <span>
              You have {this.consignmentData.length} transfer{this
                .consignmentData.length === 1
                ? ''
                : 's'}{' '}
              waiting to be received
            </span>
          )}
          {type === 'stockTake' && (
            <span>
              You have {this.consignmentData.length} count{this.consignmentData
                .length === 1
                ? ''
                : 's'}{' '}
              due
            </span>
          )}
        </div>
        <div className="ds-card-actions">
          {type === 'supplierOrder' && (
            <RBLink
              classes="ds-card-actions-link"
              isNavLink={false}
              href={this.generateConsignmentLink()}
            >
              View Order{this.consignmentData.length === 1 ? '' : 's'}
            </RBLink>
          )}
          {type === 'outletTransfer' && (
            <RBLink
              classes="ds-card-actions-link"
              isNavLink={false}
              href={this.generateConsignmentLink()}
            >
              View Transfer{this.consignmentData.length === 1 ? '' : 's'}
            </RBLink>
          )}
          {type === 'stockTake' && (
            <RBLink
              classes="ds-card-actions-link"
              isNavLink={false}
              href={this.generateConsignmentLink()}
            >
              View Count{this.consignmentData.length === 1 ? '' : 's'}
            </RBLink>
          )}
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

export default connect(state => ({
  activeUser: activeUserSelector(state)
}))(ConsignmentAlert);
