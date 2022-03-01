import _ from 'lodash';
import numeral from 'numeral';
import numeralFormatBuilder from './numberFormatBuilder';
import CurrencyCodes from '../constants/currencies.json';

function currencyFormatter(defaults) {
  if (defaults == null) {
    defaults = {};
  }
  return function(value, options) {
    var format,
      requiredSignificantFigures,
      result,
      wholeNumberDigitLength,
      _options,
      _ref,
      _currencySymbol;
    if (value == null) {
      value = 0;
    }
    if (options == null) {
      options = {};
    }
    _options = _.cloneDeep(options);
    _.defaults(_options, defaults);
    _options.decimalsInCurrency || (_options.decimalsInCurrency = 2);
    if (_options.roundInput) {
      value = Math.round(value);
    }
    wholeNumberDigitLength = parseInt(Math.abs(value), 10).toString().length;
    requiredSignificantFigures =
      wholeNumberDigitLength + _options.decimalsInCurrency;
    if (
      !_options.significantFigures ||
      (wholeNumberDigitLength < (_ref = _options.significantFigures) &&
        _ref < requiredSignificantFigures)
    ) {
      _options.significantFigures = requiredSignificantFigures;
      _options.decimalPlaces = _options.decimalsInCurrency;
    }
    if (_options.significantFigures) {
      if (!value.toPrecision) value = +value;
      value = value.toPrecision(_options.significantFigures);
    }
    _options.hasDecimalPlaces = value % 1 > 0;
    if (_options.format) {
      format = _options.format;
    } else {
      format = numeralFormatBuilder(_options);
      format = '($' + format + ')';
    }
    result = numeral(value).format(format);

    if (_options.currencySymbol) {
      _currencySymbol = (_ref = CurrencyCodes.find(
        d => d.code === _options.currencySymbol
      ))
        ? _ref.symbol_native
        : '$';
      _options.currencySymbol = _currencySymbol;
      result = result.replace('$', _options.currencySymbol);
    }
    return result;
  };
}

export default currencyFormatter;
