export const SALE_IN_PROGRESS_ID = 'sale-in-progress';

export const SALE_STATUS_NONE = 0;
export const SALE_STATUS_COMPLETED = 1;
export const SALE_STATUS_IN_PROGRESS = 2;
export const SALE_STATUS_VOIDED = 3;

export const SALE_SUBSTATUS_NONE = 0;
export const SALE_SUBSTATUS_LAYBY = 1;
export const SALE_SUBSTATUS_ON_ACCOUNT = 2;
export const SALE_SUBSTATUS_PARKED = 3;
export const SALE_SUBSTATUS_RETURN = 4;
export const SALE_SUBSTATUS_EXCHANGE = 5;

export const SALE_STATUS = [
  {
    name: 'Completed',
    entity: 'completed',
    status: SALE_STATUS_COMPLETED,
    category: 'process_returns'
  },
  {
    name: 'Layby',
    entity: 'open_layby',
    status: SALE_STATUS_IN_PROGRESS,
    subStatus: SALE_SUBSTATUS_LAYBY,
    category: 'continue_sales'
  },
  {
    name: 'Layby, completed',
    entity: 'closed_layby',
    status: SALE_STATUS_COMPLETED,
    subStatus: SALE_SUBSTATUS_LAYBY,
    category: 'process_returns'
  },
  {
    name: 'On Account, completed',
    entity: 'closed_on_account',
    status: SALE_STATUS_COMPLETED,
    subStatus: SALE_SUBSTATUS_ON_ACCOUNT,
    category: 'process_returns'
  },
  {
    name: 'On Account',
    entity: 'open_on_account',
    status: SALE_STATUS_IN_PROGRESS,
    subStatus: SALE_SUBSTATUS_ON_ACCOUNT,
    category: 'continue_sales'
  },
  {
    name: 'Parked',
    entity: 'open_parked',
    status: SALE_STATUS_IN_PROGRESS,
    subStatus: SALE_SUBSTATUS_PARKED,
    category: 'continue_sales'
  },
  {
    name: 'Voided',
    entity: 'voided',
    status: SALE_STATUS_VOIDED
  }
];
