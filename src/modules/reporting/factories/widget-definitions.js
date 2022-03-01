const definitions = [
  {
    name: 'Revenue',
    description: 'Total income from items sold (excluding tax)',
    aggregate: 'totalRevenue',
    permission: null
  },
  {
    name: 'Sale Count',
    description: 'Number of sales in this time period',
    aggregate: 'saleCount',
    permission: null
  },
  {
    name: 'Customer Count',
    description:
      'Number of unique registered customers served in a time period',
    aggregate: 'customerCount',
    permission: null
  },
  {
    name: 'Gross Profit',
    description: 'Total revenue less the cost of goods sold (excluding tax)',
    aggregate: 'grossProfit',
    permission: 'product.cost.view'
  },
  {
    name: 'Discount',
    description: 'Total amount discounted for this time period (excluding tax)',
    aggregate: 'totalDiscount',
    permission: null
  },
  {
    name: 'Discount %',
    description: 'Discount given on total sales amount (excluding tax)',
    aggregate: 'discountPercent',
    permission: null
  },
  {
    name: 'Basket Value',
    description: 'Average revenue per sale (excluding tax)',
    aggregate: 'basketValue',
    permission: null
  },
  {
    name: 'Basket Size',
    description: 'Average number of items per sale',
    aggregate: 'basketSize',
    permission: null
  }
];

export default definitions;
