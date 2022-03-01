const Filters = [
  {
    name: 'Open orders',
    entity: 'openOrders',
    status: 'open',
    type: 'supplierOrder'
  },
  {
    name: 'Open returns',
    entity: 'openReturns',
    status: 'open',
    type: 'supplierReturn'
  },
  {
    name: 'Sent orders',
    entity: 'sentOrders',
    status: 'sent',
    type: 'supplierOrder'
  },
  {
    name: 'Sent returns',
    entity: 'sentReturns',
    status: 'sent',
    type: 'supplierReturn'
  },
  {
    name: 'Received orders',
    entity: 'receivedOrders',
    status: 'received',
    type: 'supplierOrder'
  },
  {
    name: 'Overdue orders',
    entity: 'overdueOrders',
    status: 'overdue',
    type: ''
  },
  {
    name: 'Cancelled orders',
    entity: 'cancelledOrders',
    status: 'canceled',
    type: ''
  },
  {
    name: 'Failed orders',
    entity: 'failedOrders',
    status: 'failed',
    type: ''
  }
];

export default Filters;
