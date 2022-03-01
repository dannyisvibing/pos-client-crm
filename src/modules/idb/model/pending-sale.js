import _ from 'lodash';
import moment from 'moment';
import {
  SALE_STATUS_NONE,
  SALE_SUBSTATUS_NONE,
  SALE_IN_PROGRESS_ID,
  SALE_SUBSTATUS_LAYBY,
  SALE_SUBSTATUS_ON_ACCOUNT
} from '../../sale/sale.constants';
import {
  adjustFromApi,
  getPaymentMethodName,
  getLineItemDisplayUnitPrice
} from '../../sale';
import { productsSelector } from '../../product';

export default class PendingSale {
  constructor(config = {}) {
    this.id = config.id;
    this.receiptId = config.receiptId;
    this.saleStatus = config.saleStatus;
    this.saleSubStatus = config.saleSubStatus;
    this.customerId = config.customerId;
    this.saleSafeNote = config.saleSafeNote;
    this.saleSubTotal = config.saleSubTotal;
    this.saleTotalDiscount = config.saleTotalDiscount;
    this.saleDiscountType = config.saleDiscountType;
    this.saleDiscountAmount = config.saleDiscountAmount;
    this.saleTotalTax = config.saleTotalTax;
    this.saleTaxBreakdown = config.saleTaxBreakdown;
    this.saleTotalPrice = config.saleTotalPrice;
    this.salePayments = config.salePayments;
    this.saleBalance = config.saleBalance;
    this.tenderedAmount = config.tenderedAmount;
    this.lineItems = config.lineItems;
  }

  static getInitial(receipt, state) {
    if (!receipt) {
      return {
        id: SALE_IN_PROGRESS_ID,
        receiptId: null,
        saleStatus: SALE_STATUS_NONE,
        saleSubStatus: SALE_SUBSTATUS_NONE,
        customerId: null,
        saleSafeNote: '',
        saleSubTotal: 0,
        saleTotalDiscount: 0,
        saleDiscountType: 'percent',
        saleDiscountAmount: 0,
        saleTotalTax: 0,
        saleTaxBreakdown: [],
        saleTotalPrice: 0,
        salePayments: [],
        saleBalance: 0,
        tenderedAmount: 0,
        lineItems: [],
        isPristine: true
      };
    } else {
      if (
        receipt.subStatus === SALE_SUBSTATUS_LAYBY ||
        receipt.subStatus === SALE_SUBSTATUS_ON_ACCOUNT
      ) {
        receipt.lineItems.forEach(lineItem => (lineItem.confirmed = true));
      }
      const {
        subtotal,
        totalTax,
        taxBreakdown,
        receiptDisc,
        totalPrice,
        balance
      } = adjustFromApi(
        state,
        receipt.lineItems,
        receipt.discountAmount,
        receipt.discountType,
        receipt.payments
      );
      const products = productsSelector(state);

      return {
        id: SALE_IN_PROGRESS_ID,
        receiptId: receipt.receiptId,
        saleStatus: receipt.status,
        saleSubStatus: receipt.subStatus,
        customerId: receipt.customerId,
        saleSafeNote: receipt.saleNote,
        saleSubTotal: subtotal,
        saleTotalDiscount: receiptDisc,
        saleDiscountType: receipt.discountType,
        saleDiscountAmount: receipt.discountAmount,
        saleTotalTax: totalTax,
        saleTaxBreakdown: taxBreakdown,
        saleTotalPrice: totalPrice,
        salePayments: receipt.payments.map(payment => {
          return {
            ...payment,
            methodName: getPaymentMethodName(payment.methodId),
            paidDate: moment(payment.paidDate).format('ddd, D MMM YY H:ma')
          };
        }),
        saleBalance: balance,
        tenderedAmount: balance,
        lineItems: receipt.lineItems.map(lineItem => {
          const product = _.find(products, { id: lineItem.productId });
          return {
            ...lineItem,
            price: getLineItemDisplayUnitPrice(lineItem),
            name: product.name,
            variantName: product.fullname
              .replace(product.name, '')
              .replace(/^ \/ /g, '')
          };
        }),
        isPristine: true
      };
    }
  }
}
