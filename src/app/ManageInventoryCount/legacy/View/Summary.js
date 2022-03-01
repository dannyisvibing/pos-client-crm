import React from 'react';
import STOCKTAKE_ITEM_STATUS from '../../../../constants/stocktake/stocktake-item-status';
import stocktakeItemsStatusFilter from '../utils/stocktake-items-status-filter';
import { RBTabs, RBTab } from '../../../../rombostrap';

const Summary = ({
  classes,
  selectedTab,
  stocktake,
  stocktakeItems,
  onSwitchTab
}) => (
  <RBTabs classes={classes} activeValue={selectedTab} onClick={onSwitchTab}>
    {(stocktake.isInProgress() || stocktake.isCancelled()) && (
      <RBTab value={STOCKTAKE_ITEM_STATUS.uncounted}>
        Uncounted ({
          stocktakeItemsStatusFilter(
            stocktakeItems,
            STOCKTAKE_ITEM_STATUS.uncounted
          ).length
        })
      </RBTab>
    )}
    <RBTab value={STOCKTAKE_ITEM_STATUS.unmatched}>
      Unmatched ({
        stocktakeItemsStatusFilter(
          stocktakeItems,
          STOCKTAKE_ITEM_STATUS.unmatched
        ).length
      })
    </RBTab>
    <RBTab value={STOCKTAKE_ITEM_STATUS.matched}>
      Matched ({
        stocktakeItemsStatusFilter(
          stocktakeItems,
          STOCKTAKE_ITEM_STATUS.matched
        ).length
      })
    </RBTab>
    {stocktake.isInProgress() && (
      <RBTab value={STOCKTAKE_ITEM_STATUS.excluded}>
        Excluded ({
          stocktakeItemsStatusFilter(
            stocktakeItems,
            STOCKTAKE_ITEM_STATUS.excluded
          ).length
        })
      </RBTab>
    )}
    <RBTab value={STOCKTAKE_ITEM_STATUS.any}>
      All ({
        stocktakeItemsStatusFilter(stocktakeItems, STOCKTAKE_ITEM_STATUS.any)
          .length
      })
    </RBTab>
  </RBTabs>
);

export default Summary;
