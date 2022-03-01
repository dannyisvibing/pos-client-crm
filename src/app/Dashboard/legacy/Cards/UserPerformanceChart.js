import React, { Component } from 'react';
import periodDescriptionFilter from '../../utils/periodDescription';
import Tooltip from './Tooltip';
import { RBLineChart } from '../../../../rombostrap';

class UserPerformanceChart extends Component {
  state = {};

  handleTriggerTooltip = (isOpen, trigger, template) => {
    if (isOpen) {
      this.tooltip.open(trigger, template);
    } else {
      this.tooltip.close();
    }
  };

  render() {
    const { classes, period, chartConfig, data } = this.props;
    return (
      <div className={classes}>
        <h2 className="vd-text-sub-heading vd-mbl ds-user-perf-chart-title ds-align-header">
          Your Sales {periodDescriptionFilter(period)}
        </h2>
        {!!chartConfig && (
          <RBLineChart
            data={data.chartData}
            config={chartConfig}
            onTriggerTooltip={this.handleTriggerTooltip}
          />
        )}
        <Tooltip id="user-performance-tooltip" ref={c => (this.tooltip = c)} />
      </div>
    );
  }
}

export default UserPerformanceChart;
