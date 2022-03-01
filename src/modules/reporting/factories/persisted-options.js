import _ from 'lodash';
import UserConfig from './user-config';

export default class PersistedOptions {
  constructor() {
    this.userConfig = new UserConfig();
    this.datatableOptions =
      this.userConfig.get('datatable_options') || this._initPersistedOptions();
  }

  _initPersistedOptions() {
    var options;
    options = this._getDefaultPersistedOptions();
    this.userConfig.set('datatable_options', options);
    return options;
  }

  setDatatableOption(optionKey, optionValue) {
    if (optionValue == null || optionValue === void 0) {
      return;
    }
    this.datatableOptions[optionKey] = optionValue;
    return this.userConfig.set('datatable_options', this.datatableOptions);
  }

  removeOption(key) {
    this.datatableOptions = _.omit(this.datatableOptions, key);
    return this.userConfig.set('datatable_options', this.datatableOptions);
  }

  getDatatableOption(optionKey) {
    var options;
    options = this.userConfig.get('datatable_options');
    return options[optionKey];
  }

  _formatOptionBoolean(value) {
    return value === 'true' || value === true;
  }

  _validateOptionBoolean(value) {
    value = String(value);
    return value === 'true' || value === 'false';
  }

  _getDefaultPersistedOptions() {
    return {
      groupVariants: true,
      showInactiveProducts: false
    };
  }

  getOption(key) {
    return this.datatableOptions[key] || {};
  }

  setOption(key, val) {
    return this.setDatatableOption(key, val);
  }
}
