import _ from 'lodash';
import moment from 'moment';
import { SALES_TAX, QUICK_LAYOUT, refine } from '../../constants/entityModels';
import {
  taxesSelector,
  cashMovementsSelector,
  receiptsSelector
} from './index';
import { usersSelector, getUserById } from '../user';
import {
  saleInProgressSelector,
  closuresSelector,
  paymentMethodsSelector
} from '../sale';
import { productsSelector } from '../product';
import { pricebooksSelector } from '../pricebook';
import { getCurrentRegisterFromState } from '../register';
import { getCustomerById, getCustomerGroupById } from '../customer';
import { getOutletById } from '../outlet';
import displayRound from '../../utils/displayRound';
import CashMovementTypes from '../../constants/cashMovementTypes';
import {
  SALE_STATUS_NONE,
  SALE_STATUS_IN_PROGRESS,
  SALE_SUBSTATUS_LAYBY,
  SALE_SUBSTATUS_ON_ACCOUNT,
  SALE_SUBSTATUS_EXCHANGE,
  SALE_SUBSTATUS_RETURN,
  SALE_STATUS_COMPLETED,
  SALE_SUBSTATUS_NONE,
  SALE_SUBSTATUS_PARKED,
  SALE_STATUS_VOIDED
} from './sale.constants';

export const isSaleNotStarted = state => {
  const saleInProgress = saleInProgressSelector(state);
  const { saleStatus } = saleInProgress;
  return saleStatus === SALE_STATUS_NONE;
};

export const isSaleConfirmed = state => {
  const saleInProgress = saleInProgressSelector(state);
  const { saleStatus, saleSubStatus } = saleInProgress;
  return (
    saleStatus === SALE_STATUS_IN_PROGRESS &&
    (saleSubStatus === SALE_SUBSTATUS_LAYBY ||
      saleSubStatus === SALE_SUBSTATUS_ON_ACCOUNT)
  );
};

export function calcRetailPrice(supplyPrice, markup, discountAmount) {
  return calcDiscounted(calcMarkedUp(supplyPrice, markup), discountAmount);
}

export function calcDiscount(price, amount, type = 'percent') {
  amount = amount || 0;
  if (type === 'percent') {
    return price * amount / 100;
  } else {
    return amount;
  }
}

export function calcDiscounted(price, amount, type = 'percent') {
  return price - calcDiscount(price, amount, type);
}

export function calcMarkup(retailPrice, supplyPrice) {
  return (retailPrice - supplyPrice) / supplyPrice * 100;
}

export function calcMarkedUp(price, markup) {
  markup = markup || 0;
  return price * (1 + markup / 100);
}

export const getLineItemDisplayPrice = lineItem => {
  return (
    lineItem.quantity *
    calcRetailPrice(
      lineItem.supplyPrice,
      lineItem.markup,
      lineItem.discountRate
    )
  );
};

export const getLineItemDisplayUnitPrice = lineItem => {
  return calcRetailPrice(
    lineItem.supplyPrice,
    lineItem.markup,
    lineItem.discountRate
  );
};

export const getSaleActionLabel = state => {
  const saleInProgress = saleInProgressSelector(state);
  const { saleSubStatus } = saleInProgress;
  if (saleSubStatus === SALE_SUBSTATUS_RETURN) {
    return 'Return';
  } else if (saleSubStatus === SALE_SUBSTATUS_EXCHANGE) {
    return 'Exchange';
  } else {
    return 'Pay';
  }
};

const getPricebook = (state, productId) => {
  const saleInProgress = saleInProgressSelector(state);
  const customerId = saleInProgress.customerId;
  if (!customerId) return null;
  const customer = getCustomerById(state, customerId);
  const customerGroup = getCustomerGroupById(state, customer.customerGroupId);
  const pricebooks = pricebooksSelector(state);
  const bookItems = _(pricebooks)
    .filter({ customerGroupId: customerGroup.id })
    .map(pricebook => pricebook.items)
    .flatten()
    .filter(item => item.productId === productId)
    .sort((a, b) => a.retailPrice - b.retailPrice);
  if (bookItems[0]) {
    return {
      discountRate: bookItems[0].discount,
      markup: bookItems[0].markup
    };
  } else {
    return null;
  }
};

export const applyPricebookToLineItems = state => {
  const saleInProgress = saleInProgressSelector(state);
  const { lineItems } = saleInProgress;
  const updatedLineItems = lineItems.map(lineItem => {
    const pricebook = getPricebook(state, lineItem.productId);
    const discountRate = pricebook
      ? pricebook.discountRate
      : lineItem.discountRate;
    const markup = pricebook ? pricebook.markup : lineItem.markup;
    const basePrice = calcRetailPrice(
      lineItem.supplyPrice,
      markup,
      discountRate
    );
    return {
      ...lineItem,
      price: basePrice,
      basePrice,
      discountRate,
      markup
    };
  });
  return updatedLineItems;
};

export const generateLineItem = (state, productId) => {
  const products = productsSelector(state);
  const product = _.find(products, { id: productId });
  const currentRegister = getCurrentRegisterFromState(state);
  const currentOutlet = getOutletById(state, currentRegister.outletId);
  const inventoryForOutlet = _.find(product.trackingInventory, {
    outletId: currentOutlet.outletId
  });
  const productTax = _.find(product.tax, { outletId: currentOutlet.outletId });

  let saletaxId = null;
  if (productTax && productTax.salestaxId === 'product:tax:outlet-default') {
    saletaxId = currentOutlet.defaultSaletax;
  } else {
    saletaxId = (productTax || {}).salestaxId;
  }

  let discountRate = 0;
  let markup = product.markup;
  const pricebook = getPricebook(state, productId);
  discountRate = pricebook ? pricebook.discountRate : discountRate;
  markup = pricebook ? pricebook.markup : markup;
  const basePrice = calcRetailPrice(product.supplyPrice, markup, discountRate);

  const lineItem = {
    productId,
    name: product.name,
    variantName: product.fullname
      .replace(product.name, '')
      .replace(/^ \/ /g, ''),
    supplyPrice: product.supplyPrice,
    price: basePrice,
    basePrice: basePrice,
    quantity: 1,
    quantityWarn:
      ((inventoryForOutlet || {}).currentInventoryCount || 0) - 1 <= 0,
    discountRate,
    markup,
    saletaxId,
    note: ''
  };

  return lineItem;
};

export const applyChangeToLineItem = (state, lineItemIndex, change) => {
  const saleInProgress = saleInProgressSelector(state);
  let { lineItems } = saleInProgress;
  const lineItem = lineItems[lineItemIndex];
  let {
    quantityWarn,
    supplyPrice,
    price,
    basePrice,
    discountRate,
    markup
  } = lineItem;
  const key = Object.keys(change)[0];
  const value = change[key];
  const products = productsSelector(state);
  const product = _.find(products, { id: lineItem.productId });
  const currentRegister = getCurrentRegisterFromState(state);
  const currentOutlet = getOutletById(state, currentRegister.outletId);
  const inventoryForOutlet = _.find(product.trackingInventory, {
    outletId: currentOutlet.outletId
  });

  if (key === 'price') {
    price = value;
    if (price > basePrice) {
      markup = calcMarkup(price, supplyPrice);
      discountRate = 0;
    } else {
      markup = calcMarkup(basePrice, supplyPrice);
      discountRate = (basePrice - price) / basePrice * 100;
    }
  } else if (key === 'discountRate') {
    discountRate = value;
    price = calcDiscounted(basePrice, discountRate);
  } else if (key === 'quantity') {
    quantityWarn = inventoryForOutlet.currentInventoryCount - value <= 0;
  }

  const updatedLineItem = {
    ...lineItem,
    [key]: value,
    quantityWarn,
    price,
    discountRate,
    markup
  };

  return updatedLineItem;
};

export const adjustSaleChange = state => {
  const saleInProgress = saleInProgressSelector(state);
  let { lineItems, saleStatus, saleSubStatus } = saleInProgress;
  const sale = adjustFromState(state);
  if (saleStatus === SALE_STATUS_NONE) saleStatus = SALE_STATUS_IN_PROGRESS;
  if (
    saleSubStatus === SALE_SUBSTATUS_RETURN ||
    saleSubStatus === SALE_SUBSTATUS_EXCHANGE
  ) {
    saleSubStatus = lineItems.some(lineItem => lineItem.quantity > 0)
      ? SALE_SUBSTATUS_EXCHANGE
      : SALE_SUBSTATUS_RETURN;
  }
  return {
    ...saleInProgress,
    saleStatus,
    saleSubStatus,
    saleSubTotal: sale.subtotal,
    saleTotalTax: sale.totalTax,
    saleTaxBreakdown: sale.taxBreakdown,
    saleTotalDiscount: sale.receiptDisc,
    saleTotalPrice: sale.totalPrice,
    tenderedAmount: sale.balance,
    saleBalance: sale.balance,
    isPristine: false
  };
};

export const adjustFromApi = (
  state,
  lineItems,
  saleDiscountAmount,
  saleDiscountType,
  salePayments
) => {
  const saletaxes = taxesSelector(state);
  const taxBreakdown = [];
  const taxesInfoByLine = {};
  const subtotal = lineItems.reduce((total, lineItem) => {
    lineItem.unitPrice = calcRetailPrice(
      lineItem.supplyPrice,
      lineItem.markup,
      lineItem.discountRate
    );
    return total + lineItem.quantity * lineItem.unitPrice;
  }, 0);
  const receiptDisc = calcDiscount(
    subtotal,
    saleDiscountAmount,
    saleDiscountType
  );
  const totalTax = lineItems.reduce((totalTax, lineItem) => {
    const saletaxId = lineItem.saletaxId;
    const saletax = _.find(saletaxes, { id: saletaxId });
    const taxRate = (saletax || {}).rate || 0;
    const price = lineItem.quantity * lineItem.unitPrice;

    lineItem.pureLineTax = price * taxRate / 100;
    // @todo: subtotal is zero when exchange. line tax become NaN! need solution here
    lineItem.lineTax =
      price / subtotal * (subtotal - receiptDisc) * taxRate / 100;
    if (lineItem.lineTax && lineItem.lineId) {
      taxesInfoByLine[lineItem.lineId] = {
        taxName: saletax.name,
        taxAmount: lineItem.pureLineTax
      };
    }

    var index = taxBreakdown.findIndex(e => e.saletaxId === saletaxId);
    if (index !== -1) {
      taxBreakdown[index].taxAmount += lineItem.lineTax;
    } else if (lineItem.lineTax !== 0) {
      taxBreakdown.push({
        saletaxId,
        name: saletax.name,
        rate: taxRate,
        taxAmount: lineItem.lineTax
      });
    }

    lineItem.pureLineDisc =
      lineItem.quantity * calcMarkedUp(lineItem.supplyPrice, lineItem.markup) -
      price;
    lineItem.lineDisc = lineItem.pureLineDisc + price / subtotal * receiptDisc;

    totalTax += lineItem.lineTax;
    return totalTax;
  }, 0);

  const totalPrice = subtotal - receiptDisc + totalTax;
  const balance =
    totalPrice -
    salePayments.reduce((paidAmount, payment) => {
      paidAmount += payment.amount;
      return paidAmount;
    }, 0);

  return {
    subtotal: subtotal,
    totalTax: totalTax,
    taxBreakdown: taxBreakdown,
    taxesInfoByLine: taxesInfoByLine,
    receiptDisc: receiptDisc,
    totalPrice: totalPrice,
    balance: balance
  };
};

export const adjustFromState = state => {
  const saleInProgress = saleInProgressSelector(state);
  let {
    lineItems,
    saleDiscountAmount,
    saleDiscountType,
    salePayments
  } = saleInProgress;
  return adjustFromApi(
    state,
    lineItems,
    saleDiscountAmount,
    saleDiscountType,
    salePayments
  );
};

export function isCash(methodId) {
  return methodId === 'method:cash';
}

export function isCreditCard(methodId) {
  return methodId === 'method:credit_card';
}

export function isGiftCard(methodId) {
  return methodId === 'method:gift_card';
}

export function isLayby(methodId) {
  return methodId === 'method:layby';
}

export function isLoyalty(methodId) {
  return methodId === 'method:loyalty';
}

export function isOnAccount(methodId) {
  return methodId === 'method:onaccount';
}

export function isStoreCredit(methodId) {
  return methodId === 'method:store_credit';
}

export function isNormalPaymentMethod(methodId) {
  return isCash(methodId) || isCreditCard(methodId) || isGiftCard(methodId);
}

export function getPaymentMethodName(methodId) {
  switch (methodId) {
    case 'method:cash':
      return 'Cash';
    case 'method:credit_card':
      return 'Credit Card';
    case 'method:gift_card':
      return 'Gift Card';
    case 'method:layby':
      return 'Layby';
    case 'method:loyalty':
      return 'Loyalty';
    case 'method:onaccount':
      return 'On Account';
    case 'method:store_credit':
      return 'Store Credit';
    default:
      return '';
  }
}

const acceptNormalPayment = (state, paymentMethodId, tenderedAmount) => {
  const saleInProgress = saleInProgressSelector(state);
  const { saleBalance, salePayments } = saleInProgress;
  const paymentMethods = paymentMethodsSelector(state);
  const paymentMethod = _.find(paymentMethods, { methodId: paymentMethodId });
  return {
    ...saleInProgress,
    saleBalance: saleBalance - tenderedAmount,
    tenderedAmount: saleBalance - tenderedAmount,
    salePayments: salePayments.concat({
      methodId: paymentMethodId,
      amount: tenderedAmount,
      methodName: paymentMethod.name,
      paidDate: moment().format('ddd, D MMM YY H:ma')
    }),
    isPristine: false
  };
};

export const updateSaleByPaymentType = (state, paymentMethodId) => {
  const saleInProgress = saleInProgressSelector(state);
  let { tenderedAmount, saleBalance, saleSubStatus } = saleInProgress;

  const result = {};
  if (isNormalPaymentMethod(paymentMethodId)) {
    const balance = saleBalance - tenderedAmount;
    result.updatedSale = acceptNormalPayment(
      state,
      paymentMethodId,
      tenderedAmount
    );
    if (balance === 0) {
      result.nextSaleStatus = SALE_STATUS_COMPLETED;
      result.nextSaleSubStatus = SALE_SUBSTATUS_NONE;
      if (saleSubStatus === SALE_SUBSTATUS_NONE) {
        result.shouldCreateReceipt = true;
      } else if (saleSubStatus === SALE_SUBSTATUS_PARKED) {
        result.shouldUpdateReceipt = true;
      } else {
        result.nextSaleSubStatus = saleSubStatus;
        result.shouldUpdateReceipt = true;
      }
    }
  } else if (isLoyalty(paymentMethodId)) {
    // @todo:
  } else if (isLayby(paymentMethodId)) {
    result.nextSaleStatus = SALE_STATUS_IN_PROGRESS;
    result.nextSaleSubStatus = SALE_SUBSTATUS_LAYBY;
    if (
      saleSubStatus === SALE_SUBSTATUS_LAYBY ||
      saleSubStatus === SALE_SUBSTATUS_PARKED
    ) {
      result.shouldUpdateReceipt = true;
    } else if (saleSubStatus === SALE_SUBSTATUS_NONE) {
      result.shouldCreateReceipt = true;
    }
  } else if (isStoreCredit(paymentMethodId)) {
    const balance = saleBalance - tenderedAmount;
    if (
      saleSubStatus === SALE_SUBSTATUS_RETURN ||
      saleSubStatus === SALE_SUBSTATUS_EXCHANGE
    ) {
      result.updatedSale = acceptNormalPayment(
        state,
        paymentMethodId,
        tenderedAmount
      );
      if (balance !== 0) {
        // @todo:
      } else {
        result.nextSaleStatus = SALE_STATUS_COMPLETED;
        result.nextSaleSubStatus = saleSubStatus;
        result.shouldUpdateReceipt = true;
      }
    } else {
      // @todo:
    }
  } else if (isOnAccount(paymentMethodId)) {
    result.nextSaleStatus = SALE_STATUS_IN_PROGRESS;
    result.nextSaleSubStatus = SALE_SUBSTATUS_ON_ACCOUNT;
    if (
      saleSubStatus === SALE_SUBSTATUS_ON_ACCOUNT ||
      saleSubStatus === SALE_SUBSTATUS_PARKED
    ) {
      result.shouldUpdateReceipt = true;
    } else if (saleSubStatus === SALE_SUBSTATUS_NONE) {
      result.shouldUpdateReceipt = true;
    }
  }

  return result;
};

export const parkSale = state => {
  const saleInProgress = saleInProgressSelector(state);
  const { receiptId, saleSubStatus } = saleInProgress;
  const result = {};
  result.nextSaleStatus = SALE_STATUS_IN_PROGRESS;
  if (!receiptId) {
    result.nextSaleSubStatus = SALE_SUBSTATUS_PARKED;
    result.shouldCreateReceipt = true;
  } else {
    result.shouldUpdateReceipt = true;
    if (saleSubStatus === SALE_SUBSTATUS_RETURN) {
      result.nextSaleSubStatus = SALE_SUBSTATUS_RETURN;
    } else {
      result.nextSaleSubStatus = SALE_SUBSTATUS_PARKED;
    }
  }
  return result;
};

export const discardSale = state => {
  const saleInProgress = saleInProgressSelector(state);
  const { receiptId, saleSubStatus } = saleInProgress;
  if (!receiptId) {
    return null;
  } else {
    const result = {
      shouldUpdateReceipt: true,
      nextSaleStatus: SALE_STATUS_VOIDED,
      nextSaleSubStatus: saleSubStatus
    };
    return result;
  }
};

export const canSwitchSale = (state, newReceiptId) => {
  const saleInProgress = saleInProgressSelector(state);
  const { receiptId, saleStatus, saleSubStatus } = saleInProgress;
  const result = {};
  if (!receiptId && saleStatus === SALE_STATUS_NONE) {
    result.shouldFetchFromServer = true;
    result.code = 'possible';
  } else if (receiptId === newReceiptId) {
    result.code = 'possible';
  } else {
    if (receiptId) {
      if (
        saleSubStatus === SALE_SUBSTATUS_RETURN ||
        saleSubStatus === SALE_SUBSTATUS_EXCHANGE
      ) {
        result.code = 'impossible';
      } else {
        result.code = 'confirm';
      }
    } else {
      result.code = 'confirm';
    }
  }
  return result;
};

export const refineSalesTax = (raw = {}) => refine(SALES_TAX, raw);

export const refineQkLayout = (raw = {}) => refine(QUICK_LAYOUT, raw);

export const generateCashMovementsTableDatasource = state => {
  const closure = closuresSelector(state)[0];
  if (!closure) return [];
  const cashMovements = cashMovementsSelector(state);
  const users = usersSelector(state);
  const usersHash = _.keyBy(users, 'userId');
  let tableData = [];
  const user = usersHash[closure.userId];
  tableData.push({
    time: moment(closure.openingTime).format('h:mma'),
    userEmail: user.userEmail,
    userName: user.displayName,
    reason: 'Opening float',
    note: closure.notes,
    amount: displayRound(closure.openingFloat)
  });
  cashMovements.forEach(move => {
    const user = usersHash[move.userId];
    let reason = CashMovementTypes.add.find(e => e.value === move.type);
    reason =
      reason || CashMovementTypes.remove.find(e => e.value === move.type);
    tableData.push({
      time: moment(move.movedDate).format('h:mma'),
      userEmail: user.userEmail,
      userName: user.displayName,
      reason: reason ? reason.label : '-',
      note: move.note,
      amount: displayRound(move.amount)
    });
  });
  return tableData;
};

const getSaleStatusString = (status, subStatus) => {
  if (status === SALE_STATUS_COMPLETED) {
    switch (subStatus) {
      case SALE_SUBSTATUS_LAYBY:
        return 'Layby, completed';
      case SALE_SUBSTATUS_ON_ACCOUNT:
        return 'On Account, completed';
      case SALE_SUBSTATUS_RETURN:
        return 'Return, completed';
      case SALE_SUBSTATUS_EXCHANGE:
        return 'Exchange, completed';
      default:
        return 'Completed';
    }
  } else if (status === SALE_STATUS_IN_PROGRESS) {
    switch (subStatus) {
      case SALE_SUBSTATUS_LAYBY:
        return 'Layby';
      case SALE_SUBSTATUS_ON_ACCOUNT:
        return 'On Account';
      case SALE_SUBSTATUS_PARKED:
        return 'Parked';
      case SALE_SUBSTATUS_RETURN:
        return 'Parked Return';
      case SALE_SUBSTATUS_EXCHANGE:
        return 'Parked Exchange';
      default:
        return '';
    }
  } else if (status === SALE_STATUS_VOIDED) {
    return 'Voided';
  }
};

export const generateSalesHistoryTableDatasource = state => {
  const receipts = receiptsSelector(state);
  const products = productsSelector(state);

  return receipts.map(receipt => {
    const {
      receiptDate,
      receiptId,
      userId,
      outletId,
      customerId,
      saleNote,
      lineItems,
      payments,
      discountAmount,
      discountType,
      status,
      subStatus
    } = receipt;
    const {
      subtotal,
      totalTax,
      taxBreakdown,
      taxesInfoByLine,
      receiptDisc,
      totalPrice,
      balance
    } = adjustFromApi(state, lineItems, discountAmount, discountType, payments);
    const user = getUserById(state, userId);
    const outlet = getOutletById(state, outletId);
    const customer = getCustomerById(state, customerId);

    return {
      receiptId,
      date: moment(receiptDate).format('ddd, D MMM YY H:ma'),
      receiptNo: 1,
      sellerId: userId,
      sellerName: user.displayName,
      outletId,
      outletName: outlet.outletName,
      customerName: customerId
        ? `${customer.firstname} ${customer.lastname}`
        : '-',
      note: saleNote,
      saleTotal: totalPrice,
      status,
      subStatus,
      statusString: getSaleStatusString(status, subStatus),
      availableAction:
        status === SALE_STATUS_COMPLETED &&
        (subStatus !== SALE_SUBSTATUS_RETURN &&
          subStatus !== SALE_SUBSTATUS_EXCHANGE)
          ? 'return'
          : status === SALE_STATUS_IN_PROGRESS
            ? 'continue'
            : 'none',
      lineItems: lineItems.map(line => {
        const product = _.find(products, { id: line.productId });
        return {
          ...line,
          name: product.fullname,
          taxInfo: taxesInfoByLine[line.lineId]
        };
      }),
      subtotal,
      totalTax,
      taxBreakdown,
      totalDiscount: receiptDisc,
      totalPrice,
      payments,
      balance
    };
  });
};
