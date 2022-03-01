import _ from 'lodash';
import STOCKTAKE_STATUS from '../../../../constants/stocktake/status';

function filterFn(stocktake, selectedStatus, restrictedOutletIds) {
  var result = false,
    stocktakeOutletId = stocktake.outletId,
    dueStatus = stocktake.getStatus(),
    dueStatuses = [
      STOCKTAKE_STATUS.overdue,
      STOCKTAKE_STATUS.inProgress,
      STOCKTAKE_STATUS.inProgressProcessed
    ];

  if (typeof restrictedOutletIds === 'undefined') {
    result = false;
  } else if (
    selectedStatus === STOCKTAKE_STATUS.due &&
    dueStatuses.indexOf(dueStatus) > -1
  ) {
    result = true;
  } else if (selectedStatus === dueStatus) {
    result = true;
  }

  if (result) {
    if (restrictedOutletIds && restrictedOutletIds.length) {
      result = restrictedOutletIds.indexOf(stocktakeOutletId) !== -1;
    } else {
      result = true;
    }
  }

  return result;
}

function stocktakeListFilter(stocktakes, selectedStatus, restrictedOutletId) {
  var filtered = [];
  filtered = _.filter(stocktakes, function(stocktake) {
    return filterFn(stocktake, selectedStatus, restrictedOutletId);
  });
  return filtered;
}

export default stocktakeListFilter;
