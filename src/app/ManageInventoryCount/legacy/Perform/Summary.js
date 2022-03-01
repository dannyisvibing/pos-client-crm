import React from 'react';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';
import stocktakeItemCountedFilter from '../utils/stocktake-item-counted-filter';
import { RBTabs, RBTab } from '../../../../rombostrap';

const Summary = ({ selectedTab, stocktakeItems, onSwitchTab }) => (
  <RBTabs activeValue={selectedTab} onClick={onSwitchTab}>
    <RBTab value={STOCKTAKE_ITEM_STATUS.any}>
      All ({stocktakeItems.length})
    </RBTab>
    <RBTab value={STOCKTAKE_ITEM_STATUS.counted}>
      Counted ({
        stocktakeItemCountedFilter(
          stocktakeItems,
          STOCKTAKE_ITEM_STATUS.counted
        ).length
      })
    </RBTab>
    <RBTab value={STOCKTAKE_ITEM_STATUS.uncounted}>
      Uncounted ({
        stocktakeItemCountedFilter(
          stocktakeItems,
          STOCKTAKE_ITEM_STATUS.uncounted
        ).length
      })
    </RBTab>
  </RBTabs>
);

export default Summary;
