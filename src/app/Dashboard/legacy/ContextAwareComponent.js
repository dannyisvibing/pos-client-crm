import React, { Component } from 'react';
import rbDashboardService, {
  DASHBOARD_EVENTS
} from '../managers/dashboard/dashboard.service';

export default class ContextAwareComponent extends Component {
  componentWillMount() {
    this.period = rbDashboardService.getPeriod();
    this.outlet = rbDashboardService.getOutlet();
    this.user = rbDashboardService.getUser();

    this._onPeriodChange = event => {
      if (event.currentValue !== event.previousValue) {
        this.period = event.currentValue;
        this.onPeriodChange(event);
      }
    };

    this._onOutletChange = event => {
      if (event.currentValue !== event.previousValue) {
        this.outlet = event.currentValue;
        this.onOutletChange(event);
      }
    };

    this._onUserChange = event => {
      if (event.currentValue !== event.previousValue) {
        this.user = event.currentValue;
        this.onUserChange(event);
      }
    };

    this._onRefresh = () => this.onRefresh();

    if (this.props.card) {
      this._onStateChange = () => this.onCardUpdate();
      this.props.card.on('stateChange', this._onStateChange);
    }

    rbDashboardService.on(DASHBOARD_EVENTS.PERIOD_CHANGE, this._onPeriodChange);
    rbDashboardService.on(DASHBOARD_EVENTS.OUTLET_CHANGE, this._onOutletChange);
    rbDashboardService.on(DASHBOARD_EVENTS.USER_CHANGE, this._onUserChange);
    rbDashboardService.on(DASHBOARD_EVENTS.REFRESH, this._onRefresh);
  }

  componentWillUnmount() {
    if (this.props.card) {
      this.props.card.off('stateChange', this._onStateChange);
    }

    rbDashboardService.off(
      DASHBOARD_EVENTS.PERIOD_CHANGE,
      this._onPeriodChange
    );
    rbDashboardService.off(
      DASHBOARD_EVENTS.OUTLET_CHANGE,
      this._onOutletChange
    );
    rbDashboardService.off(DASHBOARD_EVENTS.USER_CHANGE, this._onUserChange);
    rbDashboardService.off(DASHBOARD_EVENTS.REFRESH, this._onRefresh);
  }

  onOutletChange() {
    return;
  }

  onPeriodChange() {
    return;
  }

  onUserChange() {
    return;
  }

  onRefresh() {
    this.loadData({ slient: true });
  }

  onCardUpdate() {
    return;
  }

  render() {
    return <div />;
  }
}
