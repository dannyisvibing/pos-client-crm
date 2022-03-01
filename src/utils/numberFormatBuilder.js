function numeralFormatBuilder(options) {
  var decimalFormat, decimals, dp, format, optionalDecimalPlaces;
  if (options.significantFigures) {
    optionalDecimalPlaces = options.significantFigures - 1;
  }
  format = '0,0';
  dp = 1 + (options.decimalPlaces || optionalDecimalPlaces || 0);
  decimals = Array(dp).join(0);
  decimalFormat = (function() {
    switch (false) {
      case !options.significantFigures:
        if (options.hasDecimalPlaces) {
          return '[.]' + decimals;
        } else {
          if (decimals.length > 0) {
            return '.[' + decimals + ']';
          } else {
            return '.';
          }
        }

      default:
        if (
          options.strictDecimalPlaces !== void 0 &&
          options.strictDecimalPlaces === false
        ) {
          return '[.]' + decimals;
        } else if (options.decimalPlaces) {
          return '.' + decimals;
        } else {
          if (decimals.length > 0) {
            return '.[' + decimals + ']';
          } else {
            return '.';
          }
        }
    }
  })();
  format = '' + format + decimalFormat;
  if (options.abbreviate) {
    format = '' + format + 'a';
  }
  return format;
}

export default numeralFormatBuilder;
