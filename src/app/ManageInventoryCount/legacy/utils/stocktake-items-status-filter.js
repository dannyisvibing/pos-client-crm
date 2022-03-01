import _ from 'lodash';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';

function stocktakeItemStatusFilter(stocktakeItems, status) {
  var filteredItems = _.filter(stocktakeItems, stocktakeItem => {
    return (
      status === STOCKTAKE_ITEM_STATUS.any ||
      status === stocktakeItem.getStatus()
    );
  });
  return filteredItems;
}

export default stocktakeItemStatusFilter;
