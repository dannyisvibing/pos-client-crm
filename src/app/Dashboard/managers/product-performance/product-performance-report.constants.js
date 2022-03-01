const dimensions = {
  row: [
    {
      key: 'productVariant'
    }
  ]
};

export const TOP_PRODUCTS_BY_COUNT = {
  dimensions,
  aggregates: {
    cell: ['itemCount'],
    row: ['itemCount']
  },
  order: [
    {
      dimension: 'productVariant',
      direction: 'desc',
      metric: 'itemCount'
    }
  ],
  from: 0,
  size: 3
};

export const TOP_PRODUCTS_BY_REVENUE = {
  dimensions,
  aggregates: {
    cell: ['totalRevenue'],
    row: ['totalRevenue']
  },
  order: [
    {
      dimension: 'productVariant',
      direction: 'desc',
      metric: 'totalRevenue'
    }
  ],
  from: 0,
  size: 3
};

export default { TOP_PRODUCTS_BY_COUNT, TOP_PRODUCTS_BY_REVENUE };
