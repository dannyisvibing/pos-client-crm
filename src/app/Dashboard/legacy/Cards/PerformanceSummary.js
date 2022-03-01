import React from 'react';
import * as upperFirst from 'lodash/upperFirst';
import { subtract, divide, multiply } from 'vend-number';
import {
  getCurrentPeriodDescription,
  getPreviousPeriodDescription
} from '../../utils/periodUtils';
import removeWidow from '../../../../utils/removeWidow';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';
import rbReportService from '../../managers/report/report.service';

/**
 * Get the appropriate sentence summarising the current period's revenue.
 *
 * @method getCurrentPeriodSummary
 *
 * @return {string}
 */
function getCurrentPeriodSummary(data, revenue, subject) {
  if (!data) {
    return '';
  }

  const periodText = getCurrentPeriodDescription(data.period);

  if (revenue <= 0) {
    return `Go well ${periodText}!`;
  }

  let subjectPossessive;
  switch (subject) {
    case 'you':
      subjectPossessive = 'you’ve';
      break;
    case 'this store':
      subjectPossessive = `${subject} has`;
      break;
    case 'your store':
      subjectPossessive = `${subject} has`;
      break;
    case 'your stores':
      subjectPossessive = `${subject} have`;
      break;
    default:
      break;
  }

  return `${upperFirst(periodText)} ${subjectPossessive} sold`;
}

/**
 * Get the appropriate sentence comparing the current period's revenue with the previous period's revenue. The
 * wording differs depending on how the current period's revenue compares with the previous period's.
 *
 * @method getPreviousPeriodComparison
 *
 * @return {string}
 */
function getPreviousPeriodComparison(
  data,
  subject,
  revenue,
  previousRevenue,
  partialPreviousRevenue,
  formatCurrency
) {
  if (!data) {
    return '';
  }

  const prevRevenueStr = formatCurrency(previousRevenue);
  const previousPeriodText = getPreviousPeriodDescription(data.period);

  if (revenue <= 0) {
    if (previousRevenue > 0) {
      return `${upperFirst(
        previousPeriodText
      )} ${subject} sold ${prevRevenueStr}.`;
    }

    // This period and last period were both 0 (or less) so display nothing
    return '';
  }

  if (revenue === partialPreviousRevenue) {
    return `That’s the same as this time ${previousPeriodText}.`;
  }

  const diff = Math.abs(subtract(revenue, partialPreviousRevenue));
  const diffStr = formatCurrency(diff);

  if (revenue > partialPreviousRevenue) {
    return `That’s ${diffStr} more than this time ${previousPeriodText}!`;
  }

  if (revenue < partialPreviousRevenue) {
    const diffPercentage = multiply(divide(diff, partialPreviousRevenue), 100);
    const partialPrevRevenueStr = formatCurrency(partialPreviousRevenue);

    if (diffPercentage <= 10) {
      const seller = subject === 'you' ? subject : 'was';
      return `That’s only ${diffStr} away from what ${seller} sold this time ${previousPeriodText}.`;
    } else {
      return `This time ${previousPeriodText} ${subject} had sold ${partialPrevRevenueStr}.`;
    }
  }
}

const PerformanceSummary = ({ classes, subject, data, formatCurrency }) => {
  var revenue = 0,
    previousRevenue = 0,
    partialPreviousRevenue = 0;

  if (data) {
    revenue = rbReportService.getAggregate(data.current, 'totalRevenue');
    previousRevenue = rbReportService.getAggregate(
      data.previous,
      'totalRevenue'
    );
    partialPreviousRevenue = rbReportService.getAggregate(
      data.partialPrevious,
      'totalRevenue'
    );
  }

  return (
    <div className={classes}>
      <div className="ds-perf-summary-heading ds-align-header">
        {removeWidow(getCurrentPeriodSummary(data, revenue, subject))}
      </div>
      {revenue > 0 && (
        <div className="ds-perf-summary-revenue">{formatCurrency(revenue)}</div>
      )}
      <div className="ds-perf-summary-comparison">
        {removeWidow(
          getPreviousPeriodComparison(
            data,
            subject,
            revenue,
            previousRevenue,
            partialPreviousRevenue,
            formatCurrency
          )
        )}
      </div>
    </div>
  );
};

export default withCurrencyFormatter(PerformanceSummary);
