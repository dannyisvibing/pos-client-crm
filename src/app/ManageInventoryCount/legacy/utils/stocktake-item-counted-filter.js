import _ from 'lodash';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';

function stocktakeItemCountedFilter(stocktakeItems, selectedCountedCriteria) {
  var filtered = [],
    filterFn;
  filterFn = function(stocktakeItem, selectedCountedCriteria) {
    var returnVal = false,
      totalCount = stocktakeItem.preCounted;

    if (!stocktakeItem) {
      returnVal = false;
    } else if (
      selectedCountedCriteria === STOCKTAKE_ITEM_STATUS.counted &&
      totalCount !== null
    ) {
      returnVal = true;
    } else if (
      selectedCountedCriteria === STOCKTAKE_ITEM_STATUS.uncounted &&
      totalCount === null
    ) {
      returnVal = true;
    } else if (selectedCountedCriteria === STOCKTAKE_ITEM_STATUS.any) {
      returnVal = true;
    }

    return returnVal;
  };

  filtered = _.filter(stocktakeItems, function(item) {
    return filterFn(item, selectedCountedCriteria);
  });

  return filtered;
}

export default stocktakeItemCountedFilter;
