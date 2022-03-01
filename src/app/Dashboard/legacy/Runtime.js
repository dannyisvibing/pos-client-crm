import React, { Component } from 'react';
import Topbar from './Topbar/Topbar';
import ErrorMessage from './ErrorMessage';
import Card from './Cards/Card';
import Tasks from './Tasks/Tasks';
import PrimaryPerformance from './Cards/PrimaryPerformance';
import RetailMetricDialog from './Dialog/RetailMetrics';
import { RBLoader, RBSection, RBButton } from '../../../rombostrap';
import Period from '../constants/period.enum';
import periodUtils from '../utils/periodUtils';
import rbDashboardService, {
  DASHBOARD_EVENTS
} from '../managers/dashboard/dashboard.service';
import WindowDelegate from '../../../rombostrap/utils/windowDelegate';
import removeWidow from '../../../utils/removeWidow';

class Runtime extends Component {
  state = {
    periods: [],
    loading: false,
    loadingFailed: false
  };

  componentWillMount() {
    this._onDashboardStateChange = event => {
      this.setState({
        loading: event.loading,
        loadingFailed: event.failed
      });
    };

    rbDashboardService.on(
      DASHBOARD_EVENTS.DASHBOARD_STATE,
      this._onDashboardStateChange
    );

    var periods = [
      {
        name: periodUtils.getCurrentPeriodDescription(Period.Day),
        value: Period.Day
      },
      {
        name: periodUtils.getCurrentPeriodDescription(Period.Week),
        value: Period.Week
      },
      {
        name: periodUtils.getCurrentPeriodDescription(Period.Month),
        value: Period.Month
      }
    ];

    var period = rbDashboardService.getPeriod();
    var outletId = (rbDashboardService.getOutlet() || {}).outletId || '';
    this.setState({ periods, period, outletId });
  }

  componentWillUnmount() {
    rbDashboardService.off(
      DASHBOARD_EVENTS.DASHBOARD_STATE,
      this._onDashboardStateChange
    );
  }

  /**
   * Whether the current viewport is small-sized (or smaller).
   *
   * @method isSmallViewport
   *
   * @return {boolean}
   */
  isSmallViewport() {
    const windowDelegate = WindowDelegate.getInstance();
    return windowDelegate.compareToViewport('small') <= 0;
  }

  handlePeriodChange = period => {
    this.setState({ period });
    rbDashboardService.setPeriod(period);
  };

  handleOutletChange = outlet => {
    this.setState({ outletId: (outlet || {}).outletId || '' });
    rbDashboardService.setOutlet(outlet);
  };

  handleShowMoreRetailMetrics = e => {
    e.preventDefault();
    this.retailMetricDialog
      .open(rbDashboardService.getCatalogue())
      .then(catalogue => {
        rbDashboardService.setCatalogue(catalogue);
      });
  };

  render() {
    return (
      <div>
        <RBSection classes="ds-top-bar-filler vd-mtm" />
        {!this.isSmallViewport() ? (
          <RBSection classes="ds-top-bar-container" sticky>
            <Topbar
              periods={this.state.periods}
              currentPeriod={this.state.period}
              currentOutlet={this.state.outletId}
              onChangePeriod={this.handlePeriodChange}
              onChangeOutlet={this.handleOutletChange}
            />
          </RBSection>
        ) : (
          <RBSection classes="ds-top-bar-container">
            <Topbar
              periods={this.state.periods}
              currentPeriod={this.state.period}
              currentOutlet={this.state.outletId}
              onChangePeriod={this.handlePeriodChange}
              onChangeOutlet={this.handleOutletChange}
            />
          </RBSection>
        )}
        <RBSection classes="ds-top-bar-container-mobile">
          {/* To Do - Mobile resoultion top bar  */}
        </RBSection>
        <div className="vd-mtl vd-mbl" />
        {!this.state.loading && (
          <div>
            {/* To Do - Primary performance component */}
            <PrimaryPerformance />
            {this.state.loadingFailed && <ErrorMessage />}
            {!this.state.loadingFailed && (
              <div>
                {/* To Do - Mobile resolution Things */}
                {/*
                                    <RBSection>
                                        <RBTab>Things to Know</RBTab>
                                        <RBTab>Things to Do</RBTab>
                                    </RBSection>
                                 */}
                <RBSection classes="vd-ptn">
                  <div className="vd-g-row vd-g-row--gutter-l">
                    <div className="vd-g-col vd-g-s-12 vd-g-m-8 vd-g-l-9 ds-things">
                      <h2 className="vd-text-signpost ds-things-header">
                        Things to Know
                      </h2>
                      <RBButton
                        category="primary"
                        modifiers={['text']}
                        classes="ds-things-show-more-cards"
                        onClick={this.handleShowMoreRetailMetrics}
                      >
                        <i className="fa fa-plus vd-mrs" />
                        Show More Retail Metrics
                      </RBButton>
                      <div className="vd-g-row vd-g-row--gutter-l">
                        {rbDashboardService.cardService
                          .getCards()
                          .map((card, i) => <Card key={i} card={card} />)}
                        {!rbDashboardService.cardService.getCards().length && (
                          <div className="ds-things-to-know-empty vd-mtxl vd-mbl">
                            <img
                              alt="Customise your dashboard retail metrics"
                              className="ds-things-to-know-empty-image vd-mtl"
                            />
                            <p className="vd-mtl">
                              {removeWidow(
                                'Want to know how your business is performing on the go? You can customise this ' +
                                  'dashboard to show Retail Metrics crucial to your business.'
                              )}
                            </p>
                            <RBButton
                              category="primary"
                              modifiers={['text']}
                              classes="ds-things-show-more-cards"
                            >
                              <i className="fa fa-plus vd-mrs" />
                              Show More Retail Metrics
                            </RBButton>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="vd-g-col vd-g-s-12 vd-g-m-4 vd-g-l-3 ds-things">
                      <h2 className="vd-text-signpost ds-things-header">
                        Things to Do
                      </h2>
                      <Tasks />
                    </div>
                  </div>
                </RBSection>
                {/* To Do - if hasReportLinks() show report links */}
                {/*
                                    <ReportLink/>
                                 */}
              </div>
            )}
          </div>
        )}
        {this.state.loading &&
          !this.state.loadingFailed && (
            <div className="vd-align-center">
              <RBSection type="tertiary">
                <RBLoader classes="vd-mtxl" />
                <h1 className="vd-text-intro vd-mtm vd-mbxl">
                  Just a moment while we load your dashboard&hellip;
                </h1>
              </RBSection>
            </div>
          )}
        <RetailMetricDialog ref={c => (this.retailMetricDialog = c)} />
      </div>
    );
  }
}

export default Runtime;
