import React from 'react';
import { CardState } from '../../managers/card/card.model';
import rbOutletReportService from '../../managers/report/outlet-report.service';
import { generateLineChartConfig } from '../../utils/chartUtils';
import ReportMetric from './ReportMetric';
import ContextAwareComponent from '../ContextAwareComponent';
import Tooltip from './Tooltip';
import { RBLineChart } from '../../../../rombostrap';

const CHART_CONFIG = {
  height: 150,
  margin: {
    top: 5,
    left: 0,
    right: 0,
    bottom: 42
  },
  linesOffset: {
    left: 10,
    right: 10
  },
  xAxisTickAlignment: 'diagonal'
};

class NumberCard extends ContextAwareComponent {
  state = {};

  componentWillMount() {
    super.componentWillMount();
    this.loadData();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  onOutletChange() {
    this.loadData();
  }

  onPeriodChange() {
    this.loadData();
  }

  loadData(options = {}) {
    const { card, format, formatCurrency } = this.props;

    if (!options.slient) {
      card.setState(CardState.Loading);
    }

    rbOutletReportService
      .getData()
      .then(reportData => {
        // PeriodReportData
        const chartData = rbOutletReportService.getChartData(
          reportData,
          this.props.metric
        );
        var chartConfig = generateLineChartConfig(
          reportData.period,
          chartData,
          {
            chartConfig: CHART_CONFIG,
            format: format
          },
          { formatCurrency }
        );
        var data = { reportData, chartData };
        this.setState({ data, chartConfig });
        card.setState(CardState.Ready);
      })
      .catch(err => {
        // To Do - Handle Error
        // var chartConfig = generateLineChartConfig()
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
    const { title, metric, average, format } = this.props;
    const { data = {}, chartConfig } = this.state;

    return (
      <div className="ds-card-component ds-number-card">
        <h2 className="vd-man">
          <span className="ds-card-header">{title}</span>
        </h2>
        <div className="ds-number-card-content vd-mtl">
          <ReportMetric
            metric={metric}
            average={!!average}
            data={data.reportData}
            format={format}
          />
          <div className="ds-number-card-chart vd-mtl">
            {!!chartConfig && (
              <RBLineChart
                data={data.chartData}
                config={chartConfig}
                onTriggerTooltip={this.handleTriggerTooltip}
              />
            )}
            <Tooltip id={`${metric}-tooltip`} ref={c => (this.tooltip = c)} />
          </div>
        </div>
      </div>
    );
  }
}

export default NumberCard;
