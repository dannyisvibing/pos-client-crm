import React from 'react';
import NumberCard from './NumberCard';
import ReportMetric from './ReportMetric';
import Tooltip from './Tooltip';
import { RBLineChart } from '../../../../rombostrap';

class DiscountsNumberCard extends NumberCard {
  componentWillMount() {
    super.componentWillMount();
    this.handleTriggerTooltip = this.handleTriggerTooltip.bind(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  handleTriggerTooltip(isOpen, trigger, template) {
    if (isOpen) {
      this.tooltip.open(trigger, template);
    } else {
      this.tooltip.close();
    }
  }

  render() {
    const { title, metric /*, average*/, format } = this.props;
    const { data = {}, chartConfig } = this.state;

    return (
      <div className="ds-card-component ds-number-card">
        <h2 className="vd-man">
          <span className="ds-card-header">{title}</span>
        </h2>
        <div className="ds-number-card-content">
          <div className="vd-g-row vd-g-row--gutter-l vd-mtl">
            <div className="vd-g-col vd-g-s-12 vd-g-m-8">
              {!!chartConfig && (
                <RBLineChart
                  config={chartConfig}
                  data={data.chartData}
                  onTriggerTooltip={this.handleTriggerTooltip}
                />
              )}
              <Tooltip id="discount-tooltip" ref={c => (this.tooltip = c)} />
            </div>
            <div className="vd-g-col vd-g-s-12 vd-g-m-4 ds-metrics-col">
              <ReportMetric
                label="Total Discounts"
                metric={metric}
                data={data.reportData}
                format={format}
              />
              <ReportMetric
                label="Total Discounts (%)"
                metric="discountPercent"
                data={data.reportData}
                format="percentage"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DiscountsNumberCard;
