import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import rbDashboardService from '../../managers/dashboard/dashboard.service';
import rbOutletPerformanceService from '../../managers/performance/outlet-performance.service';
import rbUserPerformanceService from '../../managers/performance/user-performance.service';
import WindowDelegate from '../../../../rombostrap/utils/windowDelegate';
import { CardState } from '../../managers/card/card.model';
import { DISPLAYABLE_STATES } from '../Cards/Card';
import MetricFormat from '../../constants/metric.enum';
import { generateLineChartConfig } from '../../utils/chartUtils';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';
import removeWidow from '../../../../utils/removeWidow';
import Tooltip from './Tooltip';
import ContextAwareComponent from '../ContextAwareComponent';
import PerformanceSummary from './PerformanceSummary';
import OutletPerformanceMetrics from './OutletPerformanceMetrics';
import UserPerformance from './UserPerformance';
import { RBSection, RBLoader } from '../../../../rombostrap';
import { hasPermission } from '../../../../modules/user';
import { RBLineChart } from '../../../../rombostrap';

const PrimaryPerformanceError = () => (
  <div className="ds-primary-perf-error vd-g-row">
    <div className="vd-g-s-12 vd-g-m-4 vd-g-l-12">
      <img
        alt="Cannot fetch data"
        className="ds-primary-perf-error-image vd-mtm"
      />
    </div>
    <div className="ds-primary-perf-error-text vd-mtm vd-g-s-12 vd-g-m-8 vd-g-l-12">
      <h1 className="vd-text-heading">Sorry we could't fetch some&nbsp;data</h1>
      <h2 className="vd-text-intro vd-mtm">
        Please refresh this page and try&nbsp;again.
      </h2>
    </div>
  </div>
);

class PrimaryPerformance extends ContextAwareComponent {
  state = {
    showAllSales: false,
    loadingStyles: {}
  };

  componentWillMount() {
    super.componentWillMount();
    this.card = rbDashboardService.cardService.getPrimaryCard();
    this._init(() => {
      this.loadData();
    });
  }

  componentDidMount() {
    const windowDelegate = WindowDelegate.getInstance();
    this._onViewportChangeDigest = () => this.forceUpdate();
    const viewportChange = windowDelegate.EVENTS().viewportChange;
    windowDelegate.on(
      `${viewportChange}:to-xsmall`,
      this._onViewportChangeDigest
    );
    windowDelegate.on(
      `${viewportChange}:from-xsmall`,
      this._onViewportChangeDigest
    );
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const windowDelegate = WindowDelegate.getInstance();
    if (this._onViewportChangeDigest) {
      const viewportChange = windowDelegate.EVENTS().viewportChange;
      windowDelegate.off(
        `${viewportChange}:to-xsmall`,
        this._onViewportChangeDigest
      );
      windowDelegate.off(
        `${viewportChange}:from-xsmall`,
        this._onViewportChangeDigest
      );
    }
  }

  onOutletChange() {
    if (this.state.showAllSales) {
      this.loadData();
    }
  }

  onPeriodChange() {
    this.loadData();
  }

  onUserChange() {
    this._init(() => {
      this.loadData();
    });
  }

  isLoading() {
    return this.card.getState() === CardState.Loading;
  }

  isReady() {
    return this.card.getState() === CardState.Ready;
  }

  isErrored() {
    return this.card.getState() === CardState.Error;
  }

  isDisplayable() {
    return DISPLAYABLE_STATES.indexOf(this.card.getState()) > -1;
  }

  _init(cb) {
    const showAllSales = this.props.hasPermission('reporting.sales.all');
    this._performanceDataService = showAllSales
      ? rbOutletPerformanceService
      : rbUserPerformanceService;
    this.setState({ showAllSales }, () => cb());
  }

  /**
   * Whether the current viewport is mobile-sized. Determines whether to display the performance data in a carousel
   * or not.
   *
   * @method isMobileViewport
   *
   * @return {boolean}
   */
  isMobileViewport() {
    const windowDelegate = WindowDelegate.getInstance();
    const viewport = windowDelegate.currentViewport.viewport;
    return viewport === 'xsmall';
  }

  /**
   * Get the subject of the performance summary. Either 'you', 'this store' or 'your stores'.
   *
   * @method getSummarySubject
   *
   * @return {string}
   */
  getSummarySubject() {
    if (!this.state.showAllSales) {
      return 'you';
    }

    return rbDashboardService.getStoreContextSubject();
  }

  /**
   * Get the current outlet name or 'All Outlets' if no specific outlet is selected.
   *
   * @method getOutletName
   *
   * @return {string}
   */
  getOutletName() {
    return this.outlet ? this.outlet.outletName : 'All Outlets';
  }

  loadData(options = {}) {
    // Set the css height for the loading view to that of the previous card
    // This stops the jankiness of card heights when switching from a Ready State to Loading State
    const cardHeight = ReactDom.findDOMNode(this).getBoundingClientRect()
      .height;
    this.setState({ loadingStyles: { height: `${cardHeight}px` } });

    if (!options.silent) {
      this.card.setState(CardState.Loading);
    }

    // To Do - get outlet, user, period
    const entity = this.state.showAllSales ? this.outlet : this.user;

    this._performanceDataService
      .getPerformanceData(entity, this.period)
      /**
       * @return {PerformanceData}
       */
      .then(data => {
        var chartConfig = generateLineChartConfig(
          this.period,
          data.chartData,
          {
            format: MetricFormat.CURRENCY
          },
          { formatCurrency: this.props.formatCurrency }
        );
        this.card.setState(CardState.Ready);
        this.setState({ chartConfig, data, loadingStyles: {} });
      })
      .catch(err => {
        var chartConfig = generateLineChartConfig(
          this.period,
          [],
          {
            format: MetricFormat.CURRENCY
          },
          { formatCurrency: this.props.formatCurrency }
        );
        this.setState({
          chartConfig,
          data: {
            reportData: null,
            chartData: []
          },
          loadingStyles: {}
        });
        this.card.setState(CardState.Error);
      });
  }

  handleTriggerTooltip = (isOpen, trigger, template) => {
    if (isOpen) {
      this.tooltip.open(trigger, template);
    } else {
      this.tooltip.close();
    }
  };

  render() {
    const { loadingStyles } = this.state;
    return (
      <div className="ds-primary-performance">
        <RBSection type="tertiary" classes="ds-primary-perf-section">
          {this.isLoading() && (
            <div
              style={loadingStyles}
              className={classnames('ds-primary-perf-loading ds-card-loading', {
                'vd-g-row vd-g-row--gutter-l': this.isMobileViewport()
              })}
            >
              <RBLoader />
            </div>
          )}
          {!this.isMobileViewport() &&
            this.isDisplayable() && (
              <div className="ds-primary-perf-content vd-g-row vd-g-row--gutter-l">
                {this.isErrored() && (
                  <div
                    className={classnames('vd-g-col vd-g-s-12', {
                      'vd-g-l-4': this.state.showAllSales,
                      'vd-g-l-3': !this.state.showAllSales
                    })}
                  >
                    <PrimaryPerformanceError />
                  </div>
                )}

                {!this.isErrored() && (
                  <PerformanceSummary
                    subject={this.getSummarySubject()}
                    data={this.state.data.reportData}
                    classes={classnames(
                      'ds-primary-perf-summary vd-g-col vd-g-s-12 vd-g-m-12',
                      {
                        'vd-g-l-4': this.state.showAllSales,
                        'vd-g-l-3': !this.state.showAllSales
                      }
                    )}
                  />
                )}

                {this.state.showAllSales && (
                  <div className="vd-g-col vd-g-s-12 vd-g-m-12 vd-g-l-8">
                    <div className="vd-g-row vd-g-row--gutter-l">
                      <h2 className="vd-g-col vd-g-s-12 vd-text-sub-heading ds-align-header pro-outlet-sales-chart-title">
                        {removeWidow(this.getOutletName())}
                      </h2>
                      <div className="vd-g-col vd-g-s-8">
                        <RBLineChart
                          data={this.state.data.chartData}
                          config={this.state.chartConfig}
                          onTriggerTooltip={this.handleTriggerTooltip}
                        />
                        <Tooltip
                          id="performance-tooltip"
                          ref={c => (this.tooltip = c)}
                        />
                      </div>
                      <div className="vd-g-col vd-g-s-4 ds-primary-perf-metrics">
                        <OutletPerformanceMetrics data={this.state.data} />
                      </div>
                    </div>
                  </div>
                )}

                {!this.state.showAllSales && (
                  <div className="vd-g-col vd-g-s-12 vd-g-m-12 vd-g-l-9">
                    <UserPerformance card={this.card} />
                  </div>
                )}
              </div>
            )}

          {/* To Do - isMobileViewport() && isDisplayable() */}
          {/* <Carousel></Carousel> */}
        </RBSection>
      </div>
    );
  }
}

const enhance = compose(
  connect(state => ({
    hasPermission(permission) {
      return hasPermission(state, permission);
    }
  })),
  withCurrencyFormatter
);

export default enhance(PrimaryPerformance);
