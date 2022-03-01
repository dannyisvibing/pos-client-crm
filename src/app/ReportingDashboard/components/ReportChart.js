import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import classnames from 'classnames';
import PercentageChange from '../../../modules/reporting/factories/percentage-change';
import BarChart from './BarChart';
import ChartTimeline from './ChartTimeline';

class ReportChart extends Component {
  state = {
    barChartConfig: {},
    lineChartConfig: {}
  };

  componentWillMount() {
    this.formatterOptions = {
      abbreviate: true,
      significantFigures: 3
    };
    this.renderChart();
  }

  componentWillReceiveProps(nextProps) {
    this.renderChart();
  }

  renderChart() {
    const formatterOptions = this.formatterOptions;
    const { view } = this.props;
    this.barChartConfig = {
      valFormatter: function(v) {
        return view.formatter(v, formatterOptions);
      }
    };
    this.lineChartConfig = {
      tooltipDateFormatter: function(v) {
        return moment(
          _.parseInt(v)
            .utc()
            .format('ddd Do MMM, YYYY')
        );
      },
      tooltipValueFormatter: function(v) {
        return view.formatter(v, formatterOptions);
      },
      xAxisTickFormatter: function(v) {
        var comparisonDate, currentDate, m, tickFormat;
        m = moment(_.parseInt(v)).utc();
        currentDate = moment().format('DDMMYYYY');
        comparisonDate = m.format('DDMMYYYY');
        if (currentDate === comparisonDate) {
          return 'Today';
        } else {
          switch (view.granularity.toLowerCase()) {
            case 'week':
              tickFormat = 'D MMM';
              break;
            case 'month':
              tickFormat = "MMM 'YY";
              break;
            default:
              tickFormat = 'ddd D';
          }
          return m.format(tickFormat);
        }
      }
    };
    this.config();
  }

  config() {
    var aggregateKey,
      barChartData,
      columnCount,
      data,
      datatable,
      header,
      i,
      lineChartData,
      percentageChangeOptions,
      previousTotal,
      total,
      valueObject,
      _i,
      _j,
      _len,
      _len1,
      _ref,
      _ref1;
    var formattedTotal;
    const { view } = this.props;
    datatable = view.datatable;
    data = datatable.data;
    aggregateKey = view.aggregation.key;
    datatable.applyFormatterOptions(this.formatterOptions);
    columnCount = data.aggregates.column.length;
    total = data.aggregates.column[columnCount - 1][0][aggregateKey];
    previousTotal = data.aggregates.column[columnCount - 2][0][aggregateKey];
    formattedTotal = view.formatter(total, this.formatterOptions);
    lineChartData = [];
    _ref = data.headers.columns;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      header = _ref[i];
      valueObject = {
        key: header[0],
        val: data.aggregates.column[i][0][aggregateKey]
      };
      lineChartData.push(valueObject);
    }
    barChartData = [];
    _ref1 = data.headers.rows;
    for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
      header = _ref1[i];
      barChartData.push({
        key: header[0],
        val: data.rows[i][columnCount - 1][0][aggregateKey]
      });
    }
    percentageChangeOptions = {
      positiveInfinityValue: 'Up',
      negativeInfinityValue: 'Down',
      NaNValue: 'No change',
      neutralValue: 'No Change',
      formatter: function(d) {
        return '' + d.toFixed() + '%';
      }
    };
    this.setState({
      formattedTotal,
      lineChartData,
      barChartData,
      change: new PercentageChange(
        total,
        previousTotal,
        percentageChangeOptions
      )
    });
  }

  percentChangeLayout() {
    if (this.article && this.article.offsetWidth < 280) {
      return 'displaySeperate';
    }
  }

  render() {
    const { view } = this.props;
    const { formattedTotal, change, lineChartData, barChartData } = this.state;
    return (
      <article className="widget" ref={c => (this.article = c)}>
        <h1>{view.title}</h1>
        <h2>{formattedTotal}</h2>
        <h3
          className={classnames(
            'percent-change',
            change.type(),
            this.percentChangeLayout()
          )}
        >
          <div className="change">{change.displayChange()}</div>
          <div className="relation">
            Previous {_.upperFirst(view.granularity)}
          </div>
        </h3>
        <BarChart data={barChartData} config={this.barChartConfig} />
        <ChartTimeline
          data={lineChartData}
          config={this.lineChartConfig}
          height={145}
        />
      </article>
    );
  }
}

export default ReportChart;
