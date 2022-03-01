import _ from 'lodash';

export default class PercentageChange {
  constructor(currentValue, perviousValue, options) {
    var optionsDefaults;
    this.currentValue = currentValue;
    this.perviousValue = perviousValue;
    this.options = options != null ? options : {};
    optionsDefaults = {
      positiveInfinityValue: 'Up',
      negativeInfinityValue: 'Down',
      NaNValue: 'No change',
      neutralValue: 'No change',
      formatter: function(d) {
        return '' + d.toFixed() + '%';
      }
    };

    _.defaults(this.options, optionsDefaults);
  }

  asDecimal() {
    return this.currentValue / this.perviousValue;
  }

  asPercent(dp) {
    if (dp == null) {
      dp = 0;
    }
    return Number(((this.asDecimal() - 1) * 100).toFixed(dp));
  }

  absoluteValue() {
    return Math.abs(this.asPercent());
  }

  type() {
    switch (false) {
      case !this.isNaN():
        return 'neutral';
      case !this.isPositiveInfinity():
        return 'positive';
      case !this.isNegativeInfinity():
        return 'negative';
      case !(this.asPercent() < 0):
        return 'negative';
      case !(this.asPercent() > 0):
        return 'positive';

      default:
        return 'neutral';
    }
  }

  isNaN() {
    return isNaN(this.asDecimal());
  }

  isInfinity() {
    return this.asDecimal() === Infinity || this.asDecimal() === -Infinity;
  }

  isPositiveInfinity() {
    return this.asDecimal() === Number.POSITIVE_INFINITY;
  }

  isNegativeInfinity() {
    return this.asDecimal() === Number.NEGATIVE_INFINITY;
  }

  displayChange() {
    switch (false) {
      case !this.isNaN():
        return this.options.NaNValue;
      case this.type() !== 'neutral':
        return this.options.neutralValue;
      case !this.isPositiveInfinity():
        return this.options.positiveInfinityValue;
      case !this.isNegativeInfinity():
        return this.options.negativeInfinityValue;
      default:
        return this.options.formatter(this.absoluteValue());
    }
  }
}
