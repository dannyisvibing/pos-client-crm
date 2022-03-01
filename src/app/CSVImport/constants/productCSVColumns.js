const CSVColumns = [
  {
    name: 'Product Id',
    entity: 'id'
  },
  {
    name: 'Handle',
    entity: 'handle'
  },
  {
    name: 'SKU',
    entity: 'sku'
  },
  {
    name: 'Product Name',
    entity: 'name'
  },
  {
    name: 'Product Description',
    entity: 'description'
  },
  {
    name: 'Product Type',
    entity: 'type'
  },
  {
    name: 'Tags',
    entity: 'tags'
  },
  {
    name: 'Supply Price',
    entity: 'supply_price'
  },
  {
    name: 'Retail Price',
    entity: 'retail_price'
  },
  {
    name: 'Account Code',
    entity: 'sales_account_code'
  },
  {
    name: 'Account Code Purchase',
    entity: 'purchase_account_code'
  },
  {
    name: 'Brand',
    entity: 'brand_name'
  },
  {
    name: 'Supplier',
    entity: 'supplier_name'
  },
  {
    name: 'Supplier Code',
    entity: 'supplier_code'
  },
  {
    name: 'Active',
    entity: 'active'
  },
  {
    name: 'Track Inventory',
    entity: 'has_inventory'
  },
  {
    name: 'Loyalty Value',
    entity: 'loyalty_value'
  },
  {
    name: 'Loyalty Value Default',
    entity: 'loyalty_value_default'
  },
  {
    name: 'First Variant Attribute',
    entity: 'variant_option_one_name'
  },
  {
    name: 'First Variant Value',
    entity: 'variant_option_one_value'
  },
  {
    name: 'Second Variant Attribute',
    entity: 'variant_option_two_name'
  },
  {
    name: 'Second Variant Value',
    entity: 'variant_option_two_value'
  },
  {
    name: 'Third Variant Attribute',
    entity: 'variant_option_three_name'
  },
  {
    name: 'Third Variant Value',
    entity: 'variant_option_three_value'
  },
  {
    name: 'Outlet',
    type: 'array',
    prefix: 'outlet',
    entities: [
      {
        name: 'Current Inventory Count',
        entity: 'current_inventory_count'
      },
      {
        name: 'Reorder Point Count',
        entity: 'reorder_point_count'
      },
      {
        name: 'Reorder Amount Count',
        entity: 'reorder_amount_count'
      },
      {
        name: 'Tax Name',
        entity: 'tax_name'
      },
      {
        name: 'Tax Rate',
        entity: 'tax_rate'
      }
    ]
  }
];

export default CSVColumns;
