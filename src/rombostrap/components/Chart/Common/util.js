import { divide, round, vn } from 'vend-number';

const THOUSAND = 1000;
const MILLION = THOUSAND * THOUSAND;
const BILLION = THOUSAND * MILLION;

function _getAbbreviatedNumber(n, unit) {
  const value = divide(n, unit);

  // Use parseFloat to remove any insignificant zeros from the number
  return parseFloat(round(value, 1));
}

/**
 * Abbreviates the number to an appropriate unit of scale
 *
 * @method abbreviateNumber
 * @param {Number} n
 *        The number to abbreviate
 *
 * @return {String} The abbreviated representation of the number
 */
export function abbreviateNumber(n) {
  // Get the Absolute Number so Negative and Positive values are abbreviated the same
  const abs = Math.abs(n);

  if (abs >= BILLION) {
    return `${_getAbbreviatedNumber(n, BILLION)}b`;
  } else if (abs >= MILLION) {
    return `${_getAbbreviatedNumber(n, MILLION)}m`;
  } else if (abs >= THOUSAND) {
    return `${_getAbbreviatedNumber(n, THOUSAND)}k`;
  }

  // For numbers lower than 1000, return the number to a max of 4 digits
  // Use parseFloat to remove any insignificant zeros from the number
  // To keep consistent with other returns, return the number as a string
  return parseFloat(vn(n).toFixed(3)).toString();
}

/**
 * Determines the min and max values for the y axis for a linear scale
 * Defaults upper limits of min and max to zero depending on negative values
 *
 * @method getLinearYAxisDomain
 * @param {Array} domain
 *        @param {Number} min
 *        The most min data value
 *        @param {Number} max
 *        The most max data value
 *
 * @return {Array} An array with two values, the best min and max values based on the data
 */
export function getLinearYAxisDomain([min, max]) {
  // The ratio to increase the min/max value by, so chart lines do not exceed chart boundaries
  const mod = 1.1;

  // When min is greater than zero, set the min limit of scale to zero (All numbers are positive)
  const finalMin = min > 0 ? 0 : min * mod;
  // When max is less than zero, set the max limit of scale to zero (All numbers are negative)
  const finalMax = max < 0 ? 0 : max * mod;

  return [finalMin, finalMax];
}

function pxToNumber(pxValue) {
  return parseFloat(pxValue.replace('px', ''));
}

export function getElementPureSize(element) {
  var style = window.getComputedStyle(element);
  var width = element.getBoundingClientRect().width,
    height = element.getBoundingClientRect().height,
    paddingLeft = style.getPropertyValue('padding-left'),
    paddingRight = style.getPropertyValue('padding-right'),
    paddingTop = style.getPropertyValue('padding-top'),
    paddingBottom = style.getPropertyValue('padding-bottom');
  return {
    width: width - pxToNumber(paddingLeft) - pxToNumber(paddingRight),
    height: height - pxToNumber(paddingTop) - pxToNumber(paddingBottom)
  };
}
