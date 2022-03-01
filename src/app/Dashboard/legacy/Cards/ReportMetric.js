import React from 'react';
import PropTypes from 'prop-types';
import { subtract, multiply } from 'vend-number';
import * as upperFirst from 'lodash/upperFirst';
import { getPreviousPeriodDescription } from '../../utils/periodUtils';
import displayRoundFilter from '../../../../utils/displayRound';
import rbReportService from '../../managers/report/report.service';
import MetricFormat from '../../constants/metric.enum';
import Metric from './Metric';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';

function getValue(data, metric, format, formatCurrency) {
  if (!data) {
    return '-';
  }

  const value = rbReportService.getAggregate(data.current, metric);
  if (value <= 0) {
    return '-';
  }

  return formatValueForDisplay(value, format, formatCurrency);
}

/**
 * Get the context to display beneath the metric value. If there is sufficient data to compare this context is a
 * comparison of the current value with the value from the previous period.
 *
 * @method getContext
 *
 * @return {string}
 */
function getContext(data, metric, average, format, formatCurrency) {
  if (!data) {
    return '';
  }

  const value = rbReportService.getAggregate(data.current, metric);
  const prevPeriodValue = rbReportService.getAggregate(data.previous, metric);
  const previousPeriod = getPreviousPeriodDescription(data.period);

  if (value <= 0) {
    if (prevPeriodValue <= 0) {
      return '';
    }

    return `${upperFirst(previousPeriod)} it was ${formatValueForDisplay(
      prevPeriodValue,
      format,
      formatCurrency
    )}.`;
  }

  var comparePeriod, compareValue;

  if (average) {
    comparePeriod = previousPeriod;
    compareValue = prevPeriodValue;
  } else {
    comparePeriod = `this time ${previousPeriod}`;
    compareValue = rbReportService.getAggregate(data.partialPrevious, metric);
  }

  if (value === compareValue) {
    return `Same as ${comparePeriod}`;
  }

  const diff = formatValueForDisplay(
    Math.abs(subtract(value, compareValue)),
    format,
    formatCurrency
  );
  return `${diff} ${
    value > compareValue ? 'more' : 'less'
  } than ${comparePeriod}.`;
}

function formatValueForDisplay(value = 0, format, formatCurrency) {
  switch (format) {
    case MetricFormat.CURRENCY:
      return formatCurrency(value);
    case MetricFormat.PERCENTAGE:
      return `${roundValueForDisplay(multiply(value, 100))}%`;
    default:
      return roundValueForDisplay(value);
  }
}

function roundValueForDisplay(value) {
  // Round non-currency metrics to 2 decimal places if less than 1 otherwise 1 decimal place
  const decimalPlaces = value < 1 ? 2 : 1;
  // Trim insignificant zeros for non-currency metrics
  const trimInsignificantZeros = true;

  return displayRoundFilter(value, decimalPlaces, trimInsignificantZeros);
}

const ReportMetric = ({
  classes,
  label,
  metric,
  data,
  average,
  format,
  formatCurrency
}) => (
  <Metric
    classes={classes}
    label={label}
    value={getValue(data, metric, format, formatCurrency)}
    context={getContext(data, metric, average, format, formatCurrency)}
  />
);

ReportMetric.propTypes = {
  label: PropTypes.string, // The label for the metric e.g. 'Average Sale Value'.
  metric: PropTypes.string, // The metric (aggregate) to report on e.g. 'basket_value'.
  data: PropTypes.any, // The data to retrieve the metric from.
  average: PropTypes.bool, // Whether the metric is an average (e.g. average sale value) or total (e.g. gross profit).
  format: PropTypes.oneOf(['currency', 'percentage'])
};

export default withCurrencyFormatter(ReportMetric);
