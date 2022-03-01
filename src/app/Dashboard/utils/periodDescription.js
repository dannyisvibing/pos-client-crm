import {
  getCurrentPeriodDescription,
  getPreviousPeriodDescription
} from './periodUtils';

/**
 * Filter function that formats the given period as the current/previous period description.
 *
 * @method periodDescription
 *
 * @param  {Period} period The period to get the description of
 * @param  {string} [type = 'current'] The type of description to get - supported values are 'current' and 'previous'
 *
 * @return {string} The current/previous description of the given period
 */
export default function periodDescription(period, type = 'current') {
  switch (type) {
    case 'current':
      return getCurrentPeriodDescription(period);
    case 'previous':
      return getPreviousPeriodDescription(period);
    default:
      return period.toString();
  }
}
