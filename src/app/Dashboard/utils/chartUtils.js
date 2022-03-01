import React from 'react';
import moment from 'moment';
import * as defaults from 'lodash/defaults';
import * as findIndex from 'lodash/findIndex';
import * as findLastIndex from 'lodash/findLastIndex';
import * as reduce from 'lodash/reduce';
import * as d3 from 'd3';
import displayRound from '../../../utils/displayRound';
import Period from '../constants/period.enum';
import Days from '../constants/days.enum';
import MetricFormat from '../constants/metric.enum';
import {
  getDateFormat,
  getStartOfTimeUnit,
  getPreviousDuration
} from './periodUtils';

const PreviousPeriodLabels = {
  [Period.Day]: `Last ${Days[moment().day()]}`,
  [Period.Week]: 'Last Week',
  [Period.Month]: 'Last Month'
};

/**
 * Given a collection of Data Arrays, finds the overall first and last indexes with data
 * not equal to zero.
 *
 * @method _findDataIndexRangeForDataset
 * @param {Array} dataset
 *        The collection of data values to iterate through
 * @param {String} accessor
 *        The accessor of the data axis to get values from e.g. X or Y axis values
 *
 * @return {Array} An array containing the first and last indexes of non-zero data
 */
function _findDataIndexRangeForDataset(dataset, accessor) {
  const findGreaterIndex = (a, b) => (a > b ? a : b);
  const findLesserIndex = (a, b) => ((a < b && a !== -1) || b === -1 ? a : b);

  return reduce(
    dataset,
    (indexRange, data) => {
      const currentFirstNonZeroIndex = findIndex(data, d => d[accessor] !== 0);
      const currentLastNonZeroIndex = findLastIndex(
        data,
        d => d[accessor] !== 0
      );

      let overallFirstNonZeroIndex;
      let overallLastNonZeroIndex;

      // Must be first iteration, set the current values
      if (!indexRange.length) {
        overallFirstNonZeroIndex = currentFirstNonZeroIndex;
        overallLastNonZeroIndex = currentLastNonZeroIndex;
      } else {
        overallFirstNonZeroIndex = findLesserIndex(
          currentFirstNonZeroIndex,
          indexRange[0]
        );
        overallLastNonZeroIndex = findGreaterIndex(
          currentLastNonZeroIndex,
          indexRange[1]
        );
      }

      return [overallFirstNonZeroIndex, overallLastNonZeroIndex];
    },
    []
  );
}

/**
 * Given a collection of Data Arrays, trims starting and ending zero values for the given accessor.
 * It will compare among the data arrays to establish the first and last indexes with data.
 * It will pad either side of the data with at least one zero data value if possible.
 *
 * Edgecase, if all values are equal to zero among all the datasets no trimming will occur.
 *
 * @method trimDataset
 * @param {Array} dataset
 *        The collection of data values to iterate through
 * @param {String} accessor
 *        The accessor of the data axis to get values from e.g. X or Y axis values
 *
 * @return {Array} The dataset with the starting and ending zero values removed for the accessor
 */
export function trimDataset(dataset, accessor) {
  const dataIndexRange = _findDataIndexRangeForDataset(dataset, accessor);

  if (!dataIndexRange.length || dataIndexRange[0] === -1) {
    // No starting or ending zero values found, exit with original dataset
    return dataset;
  }

  // Pad the index range by one other side to include one zero data value if possible
  const firstIndex =
    dataIndexRange[0] > 0 ? dataIndexRange[0] - 1 : dataIndexRange[0];
  // Add two for the last index. Slice is non-inclusive and we want to pad for an extra one non-zero value
  const lastIndex = dataIndexRange[1] + 2;

  // Trim each data array to the overall first and last non zero indexes
  return dataset.map(data => data.slice(firstIndex, lastIndex));
}

/**
 * Returns the appropriate tooltip label for current or previous Revenue data
 *
 * @method _getRevenueTooltipLabel
 * @param {String} date
 *        The date value for current tooltip hover
 *
 * @param {Period} period
 *        The current period for the chart data
 *
 * @param {boolean} [previous]
 *        Asserts that the label is for the previous period
 *
 * @return {string}
 */
function _getRevenueTooltipLabel(date, period, previous) {
  const utcMoment = moment(date).utc();

  if (previous) {
    utcMoment.subtract(getPreviousDuration(period));
  }

  const dateString = utcMoment.format(getDateFormat(period));
  const day = utcMoment.format('ddd');

  let label;
  switch (period) {
    case Period.Day:
      label = `${dateString} ${previous ? `Last ${day}` : 'Today'}`;
      break;
    case Period.Week:
      label = `${previous ? 'Last' : 'This'} ${day}`;
      break;
    case Period.Month:
      label = `${day}, ${dateString}`;
      break;
    default:
      break;
  }

  // Edge Case that design wants
  // When the period is this Week and the data date is today
  // Display label of `Today`
  if (
    !previous &&
    period === Period.Week &&
    moment(date).isSame(moment().utc(), 'day')
  ) {
    label = 'Today';
  }

  return label;
}

/**
 * A factory function that returns chart config for Dashing Line Charts
 *
 * @method generateLineChartConfig
 * @param {Period} currentPeriod
 *        The current period so we can reason what to configure
 *
 * @param {Hash[]} chartData
 *        The chart data so we can reason what to configure
 *
 * @param  {LineChartConfig} [customConfig]
 *         Custom chart config to override
 *
 * @return {LineChartConfig}
 */
export function generateLineChartConfig(
  currentPeriod,
  chartData,
  config,
  extra = {}
) {
  const defaultConfig = {
    height: 230,
    margin: {
      top: 5,
      left: 0,
      right: 0,
      bottom: 34
    },
    xAxisDomainFallback: _getXAxisDomainFallback(currentPeriod),
    yAxisDomainFallback: [0, 100],
    yAxisTicks: 4,
    xAxisTicks: _getOptimumXAxisTicks(currentPeriod),
    // Let D3 use default 'nice' scaling on the x axis. (Rounds the extent of scale to nice numbers)
    xScaleNice: true,
    xScaleType: 'time',
    xAxisTickFormatter: d => {
      const tickIsNotOnTheHour = moment(d).minute() > 0;

      if (tickIsNotOnTheHour && currentPeriod === Period.Day) {
        // Return early. The tick is not on the hour, we don't want to display a value.
        return;
      }

      return moment(d)
        .utc()
        .format(getDateFormat(currentPeriod));
    },
    yAxisTickFormatter: 'abbreviateNumber',
    lineConfigs: [
      {
        showPlotPoints: true
      },
      {
        label: PreviousPeriodLabels[currentPeriod]
      }
    ],
    tooltipConfig: {
      tetherTo: _tetherToFn,
      templateFn: _getLineChartTooltipTemplateFn(
        currentPeriod,
        chartData,
        config.format,
        extra
      )
    }
  };

  return defaults({}, config.chartConfig, defaultConfig);
}

/**
 * Returns the optimum amount of x axis ticks to display
 *
 * @method _getOptimumXAxisTicks
 * @param {Period} period
 *
 * @return {number|Function} The number of ticks or d3 tick function
 */
function _getOptimumXAxisTicks(period) {
  switch (period) {
    case Period.Month:
      // Ensures ticks will only be displayed for each Monday in month
      return d3.utcMonday;
    case Period.Week:
      return d3.utcDay.filter(d => {
        const daysToDisplay = [
          Days.Sunday,
          Days.Monday,
          Days.Wednesday,
          Days.Friday
        ];
        return daysToDisplay.indexOf(d.getDay()) > -1;
      });
    case Period.Day:
      return 7;
    default:
      break;
  }
}

/**
 * Generates a callback function to render tooltip content for Revenue based charts
 *
 * @method _getLineChartTooltipTemplateFn
 *
 * @param {Period} period
 *        The current period for the chart data
 *
 * @param {Hash[]} chartData
 *        A collection of both the current and previous period chart data
 *
 * @return {d3po.tooltipTemplateFn}
 */
function _getLineChartTooltipTemplateFn(period, chartData, format, extra) {
  return function(data, plotPointIndex) {
    // Check data exists for the current period at the plot point location.
    // If it does not, the tooltip must be tethered to the previous period line.
    const hasCurrentPeriodData = Boolean(chartData[0][plotPointIndex]);
    const hasPreviousPeriodData = Boolean(chartData[1][plotPointIndex]);
    const previousData = chartData[1][plotPointIndex] || {};

    // @todo Somewhat duplicated filter logic from ReportMetricCtrl. Can this be shared?
    const getValueWithFilter = (value, format) => {
      if (format === MetricFormat.CURRENCY) {
        return `${extra.formatCurrency(value)}`;
      }

      // Round non-currency values to 2 decimal places if less than 1 otherwise 1 decimal place
      const decimalPlaces = value < 1 ? 2 : 1;
      return `${displayRound(value, decimalPlaces, true)}`;
    };

    return (
      <div className="vd-align-center ds-chart-tooltip-color">
        {hasCurrentPeriodData && (
          <div className="vd-text-label">
            {_getRevenueTooltipLabel(data.x, period)}
          </div>
        )}
        {hasCurrentPeriodData && (
          <div className="vd-text-label">
            {getValueWithFilter(data.y, format)}
          </div>
        )}
        {hasCurrentPeriodData &&
          hasPreviousPeriodData && <hr className="ds-chart-tooltip-keyline" />}
        {hasPreviousPeriodData && (
          <div className="vd-text-supplementary">
            {_getRevenueTooltipLabel(previousData.x, period, true)}
          </div>
        )}
        {hasPreviousPeriodData && (
          <div className="vd-text-supplementary">
            {getValueWithFilter(previousData.y, format)}
          </div>
        )}
      </div>
    );
  };
}

/**
 * Contains the logic to determine the best plot point to tether tooltip to
 *
 * @method _tetherToFn
 *
 * @param {d3po.plotPoint[]} nearestPlotPoints
 *        A collection of both the current and previous period chart data
 *
 * @return {d3po.plotPoint} The plot point to tether the tooltip to
 */
function _tetherToFn(nearestPlotPoints) {
  if (!nearestPlotPoints.length) {
    return null;
  }

  // Firstly determine which line's plot point has the greatest
  // X axis index, nearest the cursor position.
  // The current period point takes precedence if they're the same.
  // (Simple english: Which line has the closest plot point to the cursor)
  const currentPoint = nearestPlotPoints[0];
  const previousPoint = nearestPlotPoints[1];
  const targetPlotPoint =
    previousPoint && previousPoint.index > currentPoint.index
      ? previousPoint
      : currentPoint;

  // Next check if the targeted plot point is hidden
  // We ALWAYS want to display a tooltip on visible plot points
  if (!targetPlotPoint.hidden) {
    return targetPlotPoint;
  }

  // We don't want to display a plot point if both target and previous have Zero Y axis values
  // Early exit with null
  const targetYValue = targetPlotPoint.data && targetPlotPoint.data.y;
  const previousYValue =
    previousPoint && previousPoint.data && previousPoint.data.y;
  if (!targetYValue && !previousYValue) {
    return null;
  }

  // Otherwise we have data for one of the points
  // ....show a tooltip on the targeted plot point!
  return targetPlotPoint;
}

/**
 * Returns the ideal x axis domain for the current period to use as a fallback
 *
 * @method _getXAxisDomainFallback
 *
 * @param {Period} period
 *        The current period for the dashboard
 *
 * @return {moment[]} An array of two moment objects representing the axis domain
 */
function _getXAxisDomainFallback(period) {
  const startOfPeriodString = getStartOfTimeUnit(period);
  const startDate = moment()
    .utc()
    .startOf(startOfPeriodString);
  const endDate = moment()
    .utc()
    .endOf(startOfPeriodString);

  // For the weekly period the ending domain value should be the starting hours of Sunday.
  // This means Sunday is the last axis tick rendered.
  if (period === Period.Week) {
    endDate
      .hours(0)
      .minutes(0)
      .seconds(0);
  }

  return [startDate, endDate];
}
