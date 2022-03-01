import React from 'react';

import STOCKTAKE_STATUS from '../../../../constants/stocktake/status';
import stocktakeListFilter from '../utils/stocktake-list';
import { RBTabs, RBTab } from '../../../../rombostrap';

const Summary = ({
  restrictedOutletIds,
  selectedTab,
  stocktakes,
  onSwitchList
}) => (
  <RBTabs
    modifiers={['no-border', 'large']}
    activeValue={selectedTab}
    onClick={onSwitchList}
  >
    <RBTab value={STOCKTAKE_STATUS.due}>
      Due ({
        stocktakeListFilter(
          stocktakes,
          STOCKTAKE_STATUS.due,
          restrictedOutletIds
        ).length
      })
    </RBTab>
    <RBTab value={STOCKTAKE_STATUS.upcoming}>
      Upcoming ({
        stocktakeListFilter(
          stocktakes,
          STOCKTAKE_STATUS.upcoming,
          restrictedOutletIds
        ).length
      })
    </RBTab>
    <RBTab value={STOCKTAKE_STATUS.completed}>Completed</RBTab>
    <RBTab value={STOCKTAKE_STATUS.cancelled}>Cancelled</RBTab>
  </RBTabs>
);

export default Summary;
