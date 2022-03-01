import DimensionDefinitionsService from './dimension-definitions.service';

var __indexOf =
  [].indexOf ||
  function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }
    return -1;
  };

var _availableOptions = {};

/*
    * @param [key] string Unique identifier for the option
    * @param [private] bool Flag to hide the option from the options modal
    * @param [label] string Option label
    * @param [value] (boolean|string) Default value for the option
    * @param [summary] object Map of possible values to string summary of the value
    * @param [summary] object Keys are possible option values and vals are a string summary of the option value
    */
var registry = {
  showInactiveProducts: {
    key: 'showInactiveProducts',
    label: 'Show inactive inventory',
    value: false,
    summary: {
      true: 'inactive products are shown',
      false: 'inactive products are hidden'
    }
  },
  groupVariants: {
    key: 'groupVariants',
    label: 'Show variants grouped',
    value: false,
    summary: {
      true: 'variants are grouped',
      false: 'variants are individually listed'
    }
  },
  includeGiftCards: {
    key: 'includeGiftCards',
    label: 'Include Gift Card Sales',
    value: false,
    summary: {
      true: 'gift card sales are included',
      false: 'gift card sales are not included'
    }
  }
};

/**
 * Adds the `groupVariants` option to the available options if the report has product dimensions.
 *
 * @param {ReportDefinition} def
 */
function canGroupVariants(def) {
  if (def.includeProducts === true) {
    _availableOptions['groupVariants'] = registry['groupVariants'];
    return;
  }
  if (
    __indexOf.call(
      DimensionDefinitionsService.typeSet(def.report.dimensions.row),
      'product'
    ) >= 0
  ) {
    return (_availableOptions['groupVariants'] = registry['groupVariants']);
  }
}

/**
 * Adds the `showInactiveProducts` option to the available options if the report is an inventory report.
 *
 * @param {ReportDefinition} def
 */
function canShowInactiveProducts(def) {
  if (def.report.type === 'inventory') {
    _availableOptions['showInactiveProducts'] =
      registry['showInactiveProducts'];
  }
}

function canIncludeGiftCards(def) {
  return;
}

export default class ReportOptionsService {
  /**
   * Processes registered option rules against a report definition
   *
   * @param {ReportDefinition} def
   */
  static availableOptions(def) {
    var rule, _i, _len, _ref;
    _availableOptions = {};
    _ref = [canGroupVariants, canShowInactiveProducts, canIncludeGiftCards];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      rule(def);
    }
    return _availableOptions;
  }

  /**
   * Dehydrates a collection of options into key value form.
   *
   * @param {Object} options Collection of hydrated options objects
   */
  static dehydrateOptions(options) {
    var dehydrated, key, option;
    dehydrated = {};
    for (key in options) {
      option = options[key];
      dehydrated[key] = option.value;
    }
    return dehydrated;
  }

  /**
   * Hydrates a collection of options from key value form to full option objects
   *
   * @param {Object} dehydrated
   */
  static hydrateOptions(dehydrated) {
    var hydrated, key, option, val;
    hydrated = {};
    for (key in dehydrated) {
      val = dehydrated[key];
      option = registry[key];
      option.value = val;
      hydrated[key] = option;
    }
    return hydrated;
  }
}
