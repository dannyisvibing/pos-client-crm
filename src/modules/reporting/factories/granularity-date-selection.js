import moment from 'moment';
import _ from 'lodash';

import GranularityDefinitionsService from '../granularity-definitions.service';
import DatetimeService from '../../../utils/datetimeService';
import Period from './period';

const INVALID_DATE_ERROR = new Error('Invalid date');

// const INVALID_GRANULARITY_ERROR = new Error('Invalid granularity');

// const GRANULARITY_UNDEFINED_ERROR = new Error('Granularity is undefined');

// const DATE_UNDEFINED_ERROR = new Error('Selected date is undefined');

const CONFIG_DEFAULTS = {
  periodType: 'last',
  selectedDate: new Date(),
  minDate: null,
  periodCount: 4,
  isLocalAsUTC: true,
  restrictFutureEndDate: false,
  granularity: GranularityDefinitionsService['default']()
};

export default class GranularityDateSelection {
  static getSingleSelection() {
    return new GranularityDateSelection({
      periodType: 'single',
      startDate: moment().startOf('day'),
      granularity: GranularityDefinitionsService.findByKey('single')
    });
  }

  static getRangeSelection(startDate, minDate) {
    if (startDate == null) {
      startDate = moment().subtract(1, 'week');
    }
    return new GranularityDateSelection({
      periodType: 'range',
      startDate: startDate,
      minDate: minDate,
      granularity: GranularityDefinitionsService.findByKey('range')
    });
  }

  static getAllSelection() {
    return new GranularityDateSelection({
      periodType: 'all',
      startDate: null,
      endDate: null,
      granularity: GranularityDefinitionsService.findByKey('all')
    });
  }

  static getCompareSelection() {
    return new GranularityDateSelection(CONFIG_DEFAULTS);
  }

  static getDefaultDateSelection(reportType) {
    switch (reportType) {
      case 'payment':
        return GranularityDateSelection.getCompareSelection();
      case 'inventory':
        return GranularityDateSelection.getSingleSelection();
      case 'tax':
        return GranularityDateSelection.getRangeSelection();
      default:
        return GranularityDateSelection.getCompareSelection();
    }
  }

  constructor(config) {
    if (this._config == null) {
      this._config = {};
    }
    _.defaults(config, CONFIG_DEFAULTS);
    if (config.periodType === 'single') {
      config.isLocalAsUTC = false;
      // config.minDate =
    }
    this.updateConfig(config);
    this.createPeriod();
  }

  _formatConfigValues(config) {
    if (!config.periodType) {
      config.periodType = CONFIG_DEFAULTS.periodType;
    }
    if (!_.isFinite(config.periodCount)) {
      config.periodCount = CONFIG_DEFAULTS.periodCount;
    }
    if (config.periodType === 'current_granularity') {
      this._isValidDate(config.selectedDate);
    }
    return config;
  }

  _isValidDate(date) {
    if (!(date instanceof Date || date._isAMomentObject)) {
      throw INVALID_DATE_ERROR;
    }
  }

  updateConfig(config) {
    var /*filteredConfigValues,*/ _ref;
    _.assign(this._config, config);
    /*filteredConfigValues =*/ this._formatConfigValues(this._config);
    return (
      (_ref = this._config),
      (this.minDate = _ref.minDate),
      (this.periodType = _ref.periodType),
      (this.selectedDate = _ref.selectedDate),
      (this.periodCount = _ref.periodCount),
      (this.granularity = _ref.granularity),
      (this.startDate = _ref.startDate),
      (this.endDate = _ref.endDate),
      _ref
    );
  }

  getQueryPeriod() {
    if (this._config.isLocalAsUTC) {
      return this.period.localAsUTC();
    } else {
      return this.period;
    }
  }

  getGranularityStartDate() {
    return this.getSelectedMoment()
      .startOf(this.granularity.key)
      .toDate();
  }

  getGranularityEndDate() {
    return this.getSelectedMoment()
      .endOf(this.granularity.key)
      .toDate();
  }

  getPeriodStartDate() {
    return moment(this.period.start).toDate();
  }

  getPeriodEndDate() {
    return moment(this.period.end).toDate();
  }

  getSelectedDate() {
    return moment(this.selectedDate).toDate();
  }

  getSelectedMoment() {
    return moment(this.selectedDate);
  }

  shiftSelectedDate(num) {
    var selectedDate;
    if (!(_.isNumber(num) || this.canShiftSelectedDateUp)) {
      return false;
    }
    if (num < 0) {
      selectedDate = this.getSelectedMoment().subtract(
        Math.abs(num),
        this.granularity.key
      );
    } else {
      selectedDate = this.getSelectedMoment().add(
        Math.abs(num),
        this.granularity.key
      );
    }
    return this.update({
      selectedDate: selectedDate
    });
  }

  canShiftSelectedDateUp() {
    if (this.periodType === 'current_granularity') {
      return !DatetimeService.afterTomorrow(
        moment(this.selectedDate).add(1, this.granularity.key)
      );
    } else {
      return true;
    }
  }

  update(config) {
    this.updateConfig(config);
    return this.createPeriod();
  }

  createPeriod() {
    var endMoment, endPeriod, startMoment, startPeriod;
    if (this.periodType === 'all') {
      this.period = null;
      return;
    }
    switch (this.periodType) {
      case 'to_date':
        startMoment = moment().startOf(this.granularity.key);
        endMoment = moment().startOf('second');
        break;
      case 'last_granularity':
        startMoment = moment()
          .subtract(1, this.granularity.key)
          .startOf(this.granularity.key);
        endMoment = moment()
          .subtract(1, this.granularity.key)
          .endOf(this.granularity.key);
        break;
      case 'last':
        startMoment = moment()
          .subtract(this.periodCount - 1, this.granularity.key)
          .startOf(this.granularity.key);
        endMoment = moment().endOf(this.granularity.key);
        break;
      case 'last_beginning':
        startMoment = moment(this.selectedDate).startOf(this.granularity.key);
        endMoment = moment(this.selectedDate)
          .add(this.periodCount - 1, this.granularity.key)
          .endOf(this.granularity.key);
        break;
      case 'current_granularity':
        startMoment = moment(this.selectedDate).startOf(this.granularity.key);
        startMoment = moment(startMoment).subtract(
          this.periodCount - 1,
          this.granularity.key
        );
        endMoment = moment(this.selectedDate).endOf(this.granularity.key);
        break;
      case 'range':
        startMoment = moment(this.startDate).startOf('day');
        endMoment = moment(this.endDate).endOf('day');
        break;
      case 'single':
        startMoment = moment(this.startDate).startOf('day');
        endMoment = moment(this.startDate).endOf('day');
        break;
      default:
        break;
    }
    if (
      this._config.restrictFutureEndDate &&
      DatetimeService.afterTomorrow(endMoment)
    ) {
      endMoment = moment()
        .add(1, this._config.restrictFutureEndDate)
        .endOf(this._config.restrictFutureEndDate);
    }
    startPeriod = startMoment.toDate();
    endPeriod = endMoment.toDate();
    return (this.period = new Period(startPeriod, endPeriod));
  }
}
