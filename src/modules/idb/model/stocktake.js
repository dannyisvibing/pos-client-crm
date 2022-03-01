import _ from 'lodash';
import moment from 'moment';
import API_STOCKTAKE_STATUS from '../../../constants/stocktake/api-status';
import STOCKTAKE_STATUS from '../../../constants/stocktake/status';

export default class Stocktake {
  constructor(config, fromApi) {
    config = config || {};
    this.id = config.id || null;
    this.name = config.name || '';
    this.type = config.type || 'stocktake';
    this.status = config.status || API_STOCKTAKE_STATUS.stocktake;
    this.filters = config.filters || [];
    this.outletId = config.outletId || '';
    this.version = config.version;
    this.showInactive = config.showInactive;

    // Totals
    this.totalCountGain = config.totalCountGain;
    this.totalCostGain = config.totalCostGain;
    this.totalCountLoss = config.totalCountLoss;
    this.totalCostLoss = config.totalCostLoss;

    this.dueAt = config.dueAt ? new Date(config.dueAt) : null;
    this.receivedAt = config.receivedAt ? new Date(config.receivedAt) : null;
    this.updatedAt = config.updatedAt ? new Date(config.updatedAt) : null;
    this.createdAt = config.createdAt ? new Date(config.createdAt) : null;

    if (fromApi) {
      this.filters = this.getPluralisedFilters(true);
    }
  }

  getStatus() {
    var currentTime = new Date(),
      status = this.status,
      stocktakeDue = this.dueAt,
      // Check if stocktake is due today
      stocktakeDueToday =
        stocktakeDue &&
        stocktakeDue.toDateString() === currentTime.toDateString(),
      dueStatus;

    if (status === API_STOCKTAKE_STATUS.completed) {
      dueStatus = STOCKTAKE_STATUS.completed;
    } else if (status === API_STOCKTAKE_STATUS.cancelled) {
      dueStatus = STOCKTAKE_STATUS.cancelled;
    } else if (status === API_STOCKTAKE_STATUS.inProgress) {
      dueStatus = STOCKTAKE_STATUS.inProgress;
    } else if (status === API_STOCKTAKE_STATUS.inProgressProcessed) {
      dueStatus = STOCKTAKE_STATUS.inProgressProcessed;
    } else if (!this.dueAt || stocktakeDueToday) {
      dueStatus = STOCKTAKE_STATUS.due;
    } else if (currentTime <= stocktakeDue) {
      dueStatus = STOCKTAKE_STATUS.upcoming;
    } else {
      dueStatus = STOCKTAKE_STATUS.overdue;
    }

    return dueStatus;
  }

  getDuration() {
    var duration;
    if (!this.createdAt || !this.receivedAt) {
      return null;
    }

    duration = this.receivedAt.getTime() - this.createdAt.getTime();
    return moment.duration(duration).humanize();
  }

  /**
   * Determines if stocktake has been completed but still being processed
   */
  isCompleteProcessing() {
    return this.isComplete() && this.dueAt && this.totalCountGain === null;
  }

  /**
   * Determines if stocktake has been completed and finished processing
   */
  isCompleteProcessed() {
    return this.isComplete() && this.totalCountGain;
  }

  /**
   * Determines if stocktake's status is `overdue`
   */
  isOverdue() {
    return this.getStatus() === STOCKTAKE_STATUS.overdue;
  }

  /**
   * Determines if stocktake hasn't been started (due, overdue, upcoming)
   */
  isNotStarted() {
    return this.status === API_STOCKTAKE_STATUS.stocktake;
  }

  /**
   * Determines if stocktake's status is `in progress`
   */
  isInProgress() {
    var status = this.getStatus();
    return (
      status === STOCKTAKE_STATUS.inProgress ||
      status === STOCKTAKE_STATUS.inProgressProcessed
    );
  }

  /**
   * Determines if stocktake's status is `in progress processed`
   */
  isInProgressProcessed() {
    return this.getStatus() === STOCKTAKE_STATUS.inProgressProcessed;
  }

  /**
   * Determines if stocktake is in progress
   */
  isInProgressProcessing() {
    return this.getStatus() === STOCKTAKE_STATUS.inProgress;
  }

  /**
   * Determines if stocktake's status is complete
   */
  isComplete() {
    return this.getStatus() === STOCKTAKE_STATUS.completed;
  }

  /**
   * Determines if stocktake's status is cancelled
   */
  isCancelled() {
    return this.getStatus() === STOCKTAKE_STATUS.cancelled;
  }

  /**
   * Determines if stocktake can be deleted, only scheduled stocktakes are deletable
   */
  isDeletable() {
    return this.status === API_STOCKTAKE_STATUS.stocktake;
  }

  /**
   * Returns if a stocktake is partial or not
   */
  isPartial() {
    return this.filters && this.filters.length > 0;
  }

  getUrl() {
    var action;

    switch (this.getStatus()) {
      case STOCKTAKE_STATUS.inProgress:
      case STOCKTAKE_STATUS.inProgressProcessed:
        action = `/product/inventory_count/perform/${this.id}`;
        break;
      case STOCKTAKE_STATUS.completed:
      case STOCKTAKE_STATUS.cancelled:
        action = `/product/inventory_count/view/${this.id}`;
        break;
      default:
        action = `/product/inventory_count/edit/${this.id}`;
    }

    return action;
  }

  _getFriendlyDate(date) {
    return date ? moment(date).fromNow() : null;
  }

  getFriendlyDueAtDate(type) {
    return this._getFriendlyDate(this.dueAt, type);
  }

  getPluralisedFilters(toPlural) {
    var filters = _.cloneDeep(this.filters);
    _.forEach(filters, function(filter) {
      if (toPlural) {
        // Pluralise by adding 's' to end
        filter.type += 's';
      } else {
        // Remove plural 's'
        filter.type = filter.type.slice(0, -1);
      }
    });
    return filters;
  }

  getFriendlyStartDate(type) {
    return this._getFriendlyDate(this.createdAt, type);
  }

  getFriendlyUpdatedDate(type) {
    return this._getFriendlyDate(this.updatedAt, type);
  }

  getFriendlyFinishDate(type) {
    return this._getFriendlyDate(this.receivedAt, type);
  }

  _findFilterIndex(type, value) {
    var filter = {
      type: type,
      value: value
    };

    return _.findIndex(this.filters, filter);
  }

  addFilter(type, value) {
    var filterIndex = this._findFilterIndex(type, value),
      filterAdded = false;

    if (filterIndex === -1) {
      // Filter doesn't exist, add to filters array
      this.filters.push({
        type: type,
        value: value
      });

      filterAdded = true;
    }

    return filterAdded;
  }

  removeFilter(type, value) {
    var index = this._findFilterIndex(type, value);

    if (index > -1) {
      this.filters.splice(index, 1);
    }
  }

  getFilters() {
    var groupedFilters = [];

    _.forEach(this.filters, function(filter) {
      var index = _.findIndex(groupedFilters, {
        type: filter.type
      });

      if (index === -1) {
        // Filter group does not exist yet, add to array
        groupedFilters.push({
          type: filter.type,
          filters: [filter.value]
        });
      } else {
        // Filter value does not exist in group, add to array
        groupedFilters[index].filters.push(filter.value);
      }
    });
    return groupedFilters;
  }
}
