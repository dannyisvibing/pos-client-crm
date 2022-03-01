import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import { round } from 'vend-number';

var DEFAULT_DECIMAL_PLACES = 2;
var DEFAULT_TRIM_INSIGNIFICANT = false;

/**
 * Round a given number to 2 (or otherwise specified) decimal places, optionally trimming insignificant 0s.
 *
 * @method displayRound
 *
 * @param input {String|Number}
 *        The number to round
 *
 * @param decimalPlaces {Number}
 *        The number of decimal places to round to (defaults to 2)
 *
 * @param trimInsignificant {Boolean}
 *        Whether to trim insignificant 0s (defaults to false).
 *        This option can't be used with truncateLimit.
 *
 * @param truncateLimit {Number}
 *        Decimal point limit to truncate the lowest significant figure to.
 *        This option can't be used with trimInsignificant.
 *
 * @return {String} The given number rounded to the specified number of decimal places
 */
const displayRound = (
  input,
  decimalPlaces,
  trimInsignificant,
  truncateLimit
) => {
  if (isBoolean(decimalPlaces)) {
    trimInsignificant = decimalPlaces;
  }

  trimInsignificant = isBoolean(trimInsignificant)
    ? trimInsignificant
    : DEFAULT_TRIM_INSIGNIFICANT;
  decimalPlaces = isNumber(decimalPlaces)
    ? decimalPlaces
    : DEFAULT_DECIMAL_PLACES;

  // Round valid input. If the input is invalid and can't be rounded, number.round will throw an error.
  // Instead of breaking here, swallow the error and leave validation to the controller.
  let rounded;
  try {
    rounded = round(input, decimalPlaces);
  } catch (e) {
    rounded = input;
  }

  if (trimInsignificant) {
    // Trim insignificant figures if possible, otherwise return the raw value for the validator to handle.
    rounded = !isNaN(parseFloat(rounded))
      ? parseFloat(rounded).toString()
      : rounded;
  } else if (isNumber(truncateLimit)) {
    const decimalPointIndex = rounded.indexOf('.');
    const roundedValueLength = rounded.length;
    let truncatePoint = decimalPointIndex + truncateLimit;

    // In the case of a whole number, or when the number of decimal points matches the truncation limit,
    // no further calculations are needed, so just return the rounded value.
    if (decimalPointIndex !== -1 && decimalPlaces !== truncateLimit) {
      for (let index = truncatePoint; index < roundedValueLength; index++) {
        // Bump the value of the truncatePoint when we encounter a non-zero value.
        if (rounded[index] !== '0') {
          truncatePoint = index;
        }
      }

      // If the truncatePoint matches the decimalPointIndex, we need to chop off the decimal point too,
      // therefore we don't increment the slice index.
      if (truncatePoint !== decimalPointIndex) {
        truncatePoint += 1;
      }
    }

    rounded = rounded.slice(0, truncatePoint);
  }

  return rounded;
};

export default displayRound;
