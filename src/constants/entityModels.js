import _ from 'lodash';

export const RETAILER_SETTINGS = {
  storeName: null,
  storeCname: null,
  timezone: null,
  defaultCurrency: 'USD',
  displayPrice: 'tax-exclusive',
  labelPrinterFormat: null,
  skuGeneration: 'by-number',
  currentSeqNumber: 10000,
  userSwitchingSecurity: 'greater-priviledge',
  storeCreditEnabled: false,
  giftCardEnabled: false,
  giftCardExpiryAllowed: false,
  giftCardExpiryNumber: null,
  giftCardExpiryUnit: null,
  loyaltyEnabled: false,
  earningLoyalty: 50,
  offerBonusLoyalty: false,
  bonusLoyalty: 0,
  loyaltyWelcomeEmailEnabled: false,
  loyaltyWelcomeEmailSubject: null,
  loyaltyWelcomeEmailMessage: null
};

export const RETAILER_CONTACT = {
  firstname: null,
  lastname: null,
  email: null,
  phone: null,
  website: null,
  twitter: null,
  physicalStreet1: null,
  physicalStreet2: null,
  physicalSuburb: null,
  physicalCity: null,
  physicalPostcode: null,
  physicalState: null,
  physicalCountry: null,
  postalStreet1: null,
  postalStreet2: null,
  postalSuburb: null,
  postalCity: null,
  postalPostcode: null,
  postalState: null,
  postalCountry: null
};

export const SALES_TAX = {
  id: null,
  name: null,
  rate: 0,
  version: 0
};

export const USER = {
  userId: null,
  accountType: 'cashier',
  isPrimaryUser: false,
  username: null,
  displayName: null,
  userEmail: null,
  userAvatar: null,
  targetDaily: 0,
  targetWeekly: 0,
  targetMonthly: 0,
  seenAt: null,
  restrictedOutletIds: [],
  permissions: []
};

export const OUTLET = {
  outletId: null,
  outletName: null,
  isPrimaryOutlet: false,
  defaultSaletax: null,
  orderNumberPrefix: null,
  orderNumber: 0,
  supplierReturnPrefix: null,
  supplierReturnNumber: 0,
  warnNegativeInventory: true,
  email: null,
  phone: null,
  twitter: null,
  physicalStreet1: null,
  physicalStreet2: null,
  physicalSuburb: null,
  physicalCity: null,
  physicalPostcode: null,
  physicalState: null,
  physicalCountry: null
};

export const REGISTER = {
  registerId: null,
  registerName: null,
  isPrimary: false,
  deletedAt: null,
  outletId: null,
  registerCash: null,
  receiptTemplateId: null,
  receiptNumber: 0,
  receiptPrefix: null,
  receiptSuffix: null,
  selectUserForNextSale: false,
  emailReceipt: true,
  printReceipt: true,
  askForNote: 'on-some',
  printNoteOnReceipt: true,
  showDiscountsOnReceipt: true,
  qklayoutEnabled: true,
  currentQklayoutId: null,
  openingClosureId: null,
  nextClosureIndex: 0,
  version: 0
};

export const RECEIPT_TEMPLATE = {
  id: null,
  deleted_at: null,
  updated_at: null,
  name: null,
  receiptBarcoded: null,
  receiptStyleClass: null,
  header: null,
  footer: null,
  labelChange: null,
  labelInvoice: null,
  labelInvoiceTitle: null,
  labelLineDiscount: 0,
  labelLoyalty: false,
  labelLoyaltyEarned: 0,
  labelLoyaltyLink: null,
  labelLoyaltyTotal: 0,
  labelServedBy: null,
  labelSubTotal: 0,
  labelTax: null,
  labelToPay: null,
  labelTotal: null
};

export const PRICEBOOK = {
  bookId: null,
  updatedAt: null,
  name: '',
  validOnInStore: true,
  validOnEcommerce: true,
  customerGroup: {
    name: 'All Customers'
  },
  customerGroupId: null,
  outlet: {
    name: 'All Outlets'
  },
  restrictedOutletId: null,
  validFrom: Date.now(),
  validTo: Date.now(),
  items: []
};

export const PRICEBOOK_ITEM = {
  itemId: null,
  bookId: null,
  productId: null,
  markup: 0,
  discount: 0,
  retailPrice: 0,
  loyaltyEarned: 0,
  minUnits: 0,
  maxUnits: 0
};

export const CUSTOMER = {
  id: null,
  firstname: null,
  lastname: null,
  company: null,
  code: null,
  customerGroupId: null,
  birthday: null,
  sex: null,
  phone: null,
  email: null,
  mobile: null,
  website: null,
  fax: null,
  twitter: null,
  optDirectMail: false,
  physicalStreet1: null,
  physicalStreet2: null,
  physicalSuburb: null,
  physicalCity: null,
  physicalPostcode: null,
  physicalState: null,
  physicalCountry: null,
  postalStreet1: null,
  postalStreet2: null,
  postalCity: null,
  postalPostcode: null,
  postalState: null,
  postalCountry: null,
  customField1: null,
  customField2: null,
  customField3: null,
  customField4: null,
  customerNote: null,
  storeCredit: null,
  accountBalance: null,
  enableLoyalty: false,
  loyalty: null,
  totalEarnedLoyalty: 0,
  totalRedeemedLoyalty: 0,
  totalIssuedStoreCredit: 0,
  totalRedeemedStoreCredit: 0,
  totalSpent: 0,
  last12Month: 0,
  version: 0
};

export const CUSTOMER_GROUP = {
  id: null,
  name: null,
  deletedAt: null,
  version: 0
};

export const QUICK_LAYOUT = {
  qkLayoutId: null,
  deletedAt: null,
  qkLayoutName: null,
  closeFolderEnabled: false,
  isPrimary: false,
  nodes: [],
  version: 0
};

export const refine = (model, raw) => {
  return _(raw)
    .pick(_.keys(model))
    .omitBy(_.isNull)
    .defaults(model)
    .value();
};
