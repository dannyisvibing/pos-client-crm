import React from 'react';
import rbUserPerformanceService from '../../managers/performance/user-performance.service';
import { generateLineChartConfig } from '../../utils/chartUtils';
import { CardState } from '../../managers/card/card.model';
import MetricFormat from '../../constants/metric.enum';
import ContextAwareComponent from '../ContextAwareComponent';
import UserPerformanceMetrics from './UserPerformanceMetrics';
import UserPerformanceChart from './UserPerformanceChart';

class UserPerformance extends ContextAwareComponent {
  state = {};

  componentWillMount() {
    super.componentWillMount();
    this.loadData();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  onPeriodChange() {
    this.loadData();
  }

  onUserChange() {
    this.loadData();
  }

  loadData(options = {}) {
    const { card } = this.props;

    if (!options.silent) {
      card.setState(CardState.Loading);
    }

    rbUserPerformanceService
      .getPerformanceData(this.user, this.period)
      /**
       * @return {UserPerformanceData}
       */
      .then(data => {
        var chartConfig = generateLineChartConfig(this.period, data.chartData, {
          format: MetricFormat.CURRENCY
        });
        this.setState({ chartConfig, data });
        card.setState(CardState.Ready);
      })
      .catch(err => {
        var chartConfig = generateLineChartConfig(this.period, [], {
          format: MetricFormat.CURRENCY
        });
        var data = {
          totalRevenue: null,
          targetRevenue: null,
          targetProgressPercent: null,
          reportData: null,
          chartData: []
        };
        this.setState({ chartConfig, data });
        card.setState(CardState.Error);
      });
  }

  render() {
    return (
      <div className="vd-g-row vd-g-row--gutter-l vd-g-s-up-1 vd-g-l-up-2">
        <UserPerformanceMetrics
          classes="vd-g-col ds-user-perf-totals"
          data={this.state.data}
        />
        <UserPerformanceChart
          classes="vd-g-col"
          period={this.period}
          chartConfig={this.state.chartConfig}
          data={this.state.data}
        />
      </div>
    );
  }
}

export default UserPerformance;
