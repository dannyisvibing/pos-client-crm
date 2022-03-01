import _ from 'lodash';
import numeral from 'numeral';
import numeralFormatBuilder from './numberFormatBuilder';

function numberFilter(defaults) {
  if (defaults == null) {
    defaults = {};
  }
  return function(value, options) {
    var format;
    if (options == null) {
      options = {};
    }
    options = _.defaults({}, options, defaults);
    if (options.roundInput) {
      value = Math.round(value);
    }
    if (options.significantFigures) {
      value = value.toPrecision(options.significantFigures);
    }
    options.hasDecimalPlaces = value % 1 > 0;
    if (options.min && (value == null || value < options.min)) {
      return '';
    }
    if (options.format) {
      format = options.format;
    } else {
      format = numeralFormatBuilder(options);
    }
    return numeral(value).format(format);
  };
}

export default numberFilter;
