import _ from 'lodash';
import numeral from 'numeral';
import numeralFormatBuilder from './numberFormatBuilder';

function percentFilter(initialOptions) {
  var defaults;
  if (initialOptions == null) {
    initialOptions = {};
  }
  defaults = {
    isDecimal: false,
    roundInput: false,
    format: null,
    significantFigures: null,
    NaNFormat: null
  };
  _.defaults(initialOptions, defaults);
  return function(value, options) {
    var format;
    if (value == null) {
      value = 0;
    }
    if (options == null) {
      options = {};
    }
    _.defaults(options, initialOptions);
    if (isNaN(value)) {
      return options.NaNFormat || '-';
    }
    if (!options.isDecimal) {
      value = value / 100;
    }
    if (options.roundInput) {
      value = Math.round(value);
    }
    if (options.significantFigures) {
      value = value.toPrecision(options.significantFigures);
    }
    if (options.format) {
      format = options.format;
    } else {
      format = numeralFormatBuilder(options);
      format = '(' + format + '%)';
    }
    return numeral(value).format(format);
  };
}

export default percentFilter;
