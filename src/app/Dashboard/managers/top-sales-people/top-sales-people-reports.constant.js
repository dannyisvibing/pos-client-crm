const dimensions = {
  row: [
    {
      key: 'user'
    }
  ]
};

/**
 * @interface ReportDefinition
 */
export const TOP_SALES_PEOPLE_BY_REVENUE = {
  dimensions,
  aggregates: {
    cell: ['totalRevenue'],
    row: ['totalRevenue']
  },
  order: [
    {
      dimension: 'user',
      direction: 'desc',
      metric: 'totalRevenue'
    }
  ],
  from: 0,
  size: 3
};

export default { TOP_SALES_PEOPLE_BY_REVENUE };
