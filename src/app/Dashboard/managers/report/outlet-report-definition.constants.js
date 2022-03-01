const dimensions = {
  row: [
    {
      key: 'outlet'
    }
  ],
  column: [
    {
      key: 'day'
    }
  ]
};

const order = [
  {
    dimension: 'outlet',
    direction: 'desc',
    metric: 'totalRevenue',
    alphabetical: false
  }
];

export const OUTLET_REPORT_DEFINITION = {
  dimensions,
  aggregates: {
    cell: [
      'basketValue',
      'basketSize',
      'customerAttachment',
      'grossProfit',
      'saleCount',
      'totalDiscount',
      'totalRevenue'
    ],
    column: [
      'basketValue',
      'basketSize',
      'customerAttachment',
      'grossProfit',
      'saleCount',
      'totalDiscount',
      'totalRevenue'
    ],
    table: [
      'basketValue',
      'basketSize',
      'customerAttachment',
      'grossProfit',
      'saleCount',
      'totalDiscount',
      'totalRevenue'
    ]
  },
  order
};
