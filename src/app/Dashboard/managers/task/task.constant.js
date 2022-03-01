import React from 'react';
import { CardState } from '../card/card.model';
import ConsignmentAlert from '../../legacy/Tasks/ConsignmentAlert';

const TASKS = {
  'consignment.alert.supplier': {
    Component: ({ task }) => (
      <ConsignmentAlert task={task} type="supplierOrder" />
    )
  },
  'consignment.alert.outlet': {
    Component: ({ task }) => (
      <ConsignmentAlert task={task} type="outletTransfer" />
    )
  },
  'consignment.alert.stocktake': {
    Component: ({ task }) => <ConsignmentAlert task={task} type="stockTake" />
  },
  consignment: {
    Component: <div />,
    initialState: CardState.Ready
  },
  upsell: {
    Component: <div />,
    initialState: CardState.Ready
  },
  media: {
    Component: <div />,
    initialState: CardState.Ready
  }
};

export default TASKS;
