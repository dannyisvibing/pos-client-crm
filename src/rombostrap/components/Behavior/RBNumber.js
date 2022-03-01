import isEmpty from 'lodash/isEmpty';
import isNaN from 'lodash/isNaN';
import { vn } from 'vend-number';

import displayRoundFilter from '../../utils/displayRound';
import { isDefined, isUndefined } from '../../utils/assert';

export default class RBNumber {
  link(element, options) {
    this.element = element;
    this.options = options;

    // this.element.addEventListener('blur', () => {
    //     this.setViewValue();
    // }, true);
  }

  /**
   * Model -> View: Format given model input value and return the correct display value taking configured
   * options into account, e.g. decimalPlaces & trimInsignificant digits settings.
   *
   * @private
   * @method formatRomboNumber
   *
   * @param input {VendNumber}
   *        A vend number input value to format for display.
   *
   * @return {String} The given vend number input formatted for display.
   */
  formatRomboNumber(input, isElementFocussed) {
    let formattedNumber;

    if (input !== undefined && input !== null) {
      formattedNumber = String(input);
    } else {
      formattedNumber = input;
    }

    if (isElementFocussed) {
      // If element is currently focused, don't format for display until blur, & just return current
      // element input value to prevent *any* changes while the user (or protractor test) is typing.
      return this.element.value;
    }

    if (!isEmpty(formattedNumber)) {
      formattedNumber = displayRoundFilter(
        formattedNumber,
        this.options.decimalPlaces,
        this.options.trimInsignificantDigits
      );
    }

    // // If the formattedNumber is undefined and a fallback value is available render that in the input
    // // Example: this could be used for in field user feedback for invalid fields
    // if (!isDefined(formattedNumber) && isDefined(scope.vdNumberErrorFallback)) {
    //     formattedNumber = scope.vdNumberErrorFallback

    //     // we set the form as dirty so the styles for invalid forms are applied
    //     ngModelCtrl.$setDirty()
    // }

    return formattedNumber;
  }

  /**
   * View -> Model: Parse given display input value (remove any allowed characters) and return the correct
   * model value.
   *
   * There are special cases implemented for when the input is currently focused (i.e. we can assume from
   * this that the user is still typing) whereby certain usually invalid cases are interpreted as 0 for
   * example to ensure that calculations and validity do not break prematurely to a valid number being finished
   * (e.g. in cases of slow typing and such).
   *
   * @private
   * @method parseRomboNumber
   *
   * @param input {VendNumber}
   *        A vend number input value to parse and round for display.
   *
   * @return {String} The given vend number input parsed for model.
   */
  parseRomboNumber(input) {
    var allowNegative =
      !isDefined(this.options.min) || Number(this.options.min) < 0;
    var allowedPrefix = this.options.allowedPrefix;
    var allowEmpty = this.options.allowEmpty;
    var parsedNumber = input;

    // Special case to handle empty input as valid while typing when empty is not allowed.
    if (!allowEmpty && isEmpty(parsedNumber)) {
      parsedNumber = '0';
    }
    // When empty is allowed the empty string will be returned validly no matter if focused or not.

    // Special case to handle the input of allowedPrefix alone as valid while typing
    if (allowedPrefix && parsedNumber === allowedPrefix) {
      parsedNumber = '0';
    }

    if (this.options.allowedPrefix) {
      parsedNumber = String(parsedNumber).replace(allowedPrefix, '');
    }

    // @note allowedSuffix alone is invalid (i.e. because you do not type suffix first)
    if (this.options.allowedSuffix && parsedNumber.length > 1) {
      parsedNumber = String(parsedNumber).replace(
        this.options.allowedSuffix,
        ''
      );
    }

    // Remove all characters except for 0-9, - and .
    if (this.options.stripNonNumeric) {
      parsedNumber = String(parsedNumber).replace(/[^\d.-]/g, '');
    }

    // Special case to handle the input of "-" or "." alone as valid while typing (this is specifically
    // handled after already parsing prefix / suffixes due to cases like "-$50")
    if ((allowNegative && parsedNumber === '-') || parsedNumber === '.') {
      parsedNumber = '0';
    }

    // If the total length of the string after trimming is zero, there is no true value present (only spaces), so
    // set to zero unless allowEmpty is true.
    if (!allowEmpty && String(parsedNumber).trim().length === 0) {
      parsedNumber = '0';
    }

    return parsedNumber;
  }

  setViewValue() {
    const parsedInputValue = this.parseRomboNumber(this.element.value);
    let viewValue;

    if (!this.options.allowEmpty || !isEmpty(parsedInputValue)) {
      viewValue = displayRoundFilter(
        parsedInputValue,
        this.options.decimalPlaces,
        this.options.trimInsignificantDigits,
        this.options.truncateLimit
      );
    } else {
      viewValue = parsedInputValue;
    }

    this.element.value = viewValue;
  }

  /**
   * Ensure the value is a valid number. This is instead of setting the input to be a number, because this
   * doesn't allow us to enforce decimal places.
   *
   * @method validCharacters
   *
   * @param value {VendNumber}
   *        The value to validate (has been parsed).
   *
   * @return {Boolean} Returns true if given value is a valid number, otherwise false.
   */
  validCharacters = function(value) {
    var validCharacters = true;

    if (!this.options.allowEmpty && isEmpty(value)) {
      validCharacters = false;
    }

    validCharacters = !isNaN(Number(value));

    return validCharacters;
  };

  /**
   * Return true when given value is above configured min.
   *
   * @method validMinValue
   *
   * @param value {VendNumber}
   *        The value to validate.
   *
   * @return {Boolean} Returns true when given value is above min, otherwise false.
   */
  validMinValue = function(value) {
    if (isUndefined(this.options.min)) {
      return true;
    }

    if (isNaN(Number(value))) {
      return false;
    }

    if (this.options.exclusiveMinimum) {
      return vn(value).gt(this.options.min);
    }

    return vn(value).gte(this.options.min);
  };

  /**
   * Return true when given value is below configured max.
   *
   * @method validMaxValue
   *
   * @param value {VendNumber}
   *        The value to validate.
   *
   * @return {Boolean} Returns true when given value is below max, otherwise false.
   */
  validMaxValue = function(value) {
    if (isUndefined(this.options.max)) {
      return true;
    }

    if (isNaN(Number(value))) {
      return false;
    }

    if (this.options.exclusiveMaximum) {
      return vn(value).lt(this.options.max);
    }

    return vn(value).lte(this.options.max);
  };

  validate(value) {
    return (
      this.validMinValue(value) &&
      this.validMaxValue(value) &&
      this.validCharacters(value)
    );
  }
}
