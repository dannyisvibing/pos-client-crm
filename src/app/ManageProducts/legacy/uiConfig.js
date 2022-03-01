export const PRODUCT_OUTLET_DEFAULT_TAX_VALUE = 'product:tax:outlet-default';

export const ProductTypeInInventory = [
  {
    label: 'Standard',
    img: '/img/product-type-icon-standard.png',
    id: 'product:type-inventory:standard'
  },
  {
    label: 'Composite',
    img: '/img/product-type-icon-composite.png',
    id: 'product:type-inventory:composite'
  }
];
export const ProductLiteralType = [
  {
    label: '',
    value: '',
    ignore: true
  },
  {
    label: '+ Add type',
    value: 'product:type:add:new'
  }
];

export const ProductBrand = [
  {
    label: '',
    value: '',
    ignore: true
  },
  {
    label: '+ Add new brand',
    value: 'product:brand:add:new'
  }
];

export const ProductSupplier = [
  {
    label: '',
    value: '',
    ignore: true
  },
  {
    label: '+ Add new supplier',
    value: 'product:supplier:add:new'
  }
];

export const VariantAttributeName = [
  {
    label: 'Please select an option',
    value: '',
    ignore: true
  },
  {
    label: '+ Add variant attribute',
    value: 'product:variant:attr:add'
  }
];

export const ProductTaxByOutlet = [
  {
    label: 'Default tax for this outlet',
    value: PRODUCT_OUTLET_DEFAULT_TAX_VALUE
  },
  {
    label: 'No Tax',
    value: 'product:tax:no-tax'
  }
];
