const dimensions = {
  row: [
    {
      key: 'user'
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
    dimension: 'user',
    direction: 'desc',
    metric: 'totalRevenue',
    alphabetical: false
  }
];

const USER_REPORT_DEFINITION = {
  dimensions,
  aggregates: {
    cell: ['totalRevenue'],
    column: ['totalRevenue'],
    table: ['totalRevenue', 'basketValue', 'basketSize']
  },
  order
};

export default USER_REPORT_DEFINITION;
