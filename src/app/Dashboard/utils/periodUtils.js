import moment from 'moment';
import Period from '../constants/period.enum';
import Days from '../constants/days.enum';

/**
 * Get the moment-compatible string equivalent of the given period for the moment `startOf` method
 *
 * @export
 * @function getStartOfTimeUnit
 *
 * @param  {Period} period
 *
 * @return {moment.unitOfTime.StartOf} The moment-compatible string equivalent of the given period e.g. "month", "day"
 */
export function getStartOfTimeUnit(period) {
  switch (period) {
    case Period.Month:
      return 'month';
    case Period.Week:
      return 'isoWeek';
    case Period.Day:
      return 'day';
    default:
      break;
  }
}

/**
 * Retrieve the moment Duration to use for calculating the previous period.
 *
 * @export
 * @function getPreviousDuration
 *
 * @param  {Period} period
 *
 * @return {moment.Duration} The moment Duration for calculating the previous period
 */
export function getPreviousDuration(period) {
  switch (period) {
    case Period.Month:
      // Set to 4 weeks so we can retrieve the same day (e.g. 2nd Tues) but from the previous month
      return moment.duration(4, 'weeks');
    case Period.Week:
      return moment.duration(1, 'weeks');
    case Period.Day:
      // Set to 1 weeks so we can retrieve the same day but from the previous week
      return moment.duration(1, 'weeks');
    default:
      break;
  }
}

/**
 * Get the default granularity to use for the given period. For example, the default granularity for a month period is
 * "week".
 *
 * @export
 * @function getGranularity
 *
 * @param  {Period} period
 *
 * @return {unitOfTime.Base} get the default granularity to use for the given period e.g. "hour" for a day period
 */
export function getGranularity(period) {
  switch (period) {
    case Period.Month:
      return 'day';
    case Period.Week:
      return 'day';
    case Period.Day:
      return 'hour';
    default:
      break;
  }
}

/**
 * Get the moment-compatible date format to use on a chart for the given period.
 *
 * @export
 * @function getDateFormat
 *
 * @param  {Period} period
 *
 * @return {string} the moment-compatible date format to format dates within this period
 */
export function getDateFormat(period) {
  switch (period) {
    case Period.Month:
      return 'D MMM';
    case Period.Week:
      return 'ddd D';
    case Period.Day:
      return 'ha';
    default:
      break;
  }
}

/**
 * Get the description of the current period that can be used in a sentence e.g. "today", "this week".
 *
 * @export
 * @function getCurrentPeriodDescription
 *
 * @param  {Period} period
 *
 * @return {string} the description of the current period e.g. "this month"
 */
export function getCurrentPeriodDescription(period) {
  switch (period) {
    case Period.Month:
      return 'this month';
    case Period.Week:
      return 'this week';
    case Period.Day:
      return 'today';
    default:
      break;
  }
}

/**
 * Get the description of the previous period that can be used in a sentence e.g. "last Tuesday", "last week".
 *
 * @export
 * @function getPreviousPeriodDescription
 *
 * @param  {Period} period
 *
 * @return {string} the description of the previous period e.g. "last month"
 */
export function getPreviousPeriodDescription(period) {
  switch (period) {
    case Period.Month:
      return 'last month';
    case Period.Week:
      return 'last week';
    case Period.Day:
      return `last ${Days.values[moment().day()]}`;
    default:
      break;
  }
}

export default {
  getStartOfTimeUnit,
  getPreviousDuration,
  getGranularity,
  getDateFormat,
  getCurrentPeriodDescription,
  getPreviousPeriodDescription
};
