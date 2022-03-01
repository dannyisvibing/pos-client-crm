import _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from '../../utils/http';
import {
  calcRetailPrice,
  isSaleNotStarted,
  isSaleConfirmed,
  getLineItemDisplayPrice,
  getLineItemDisplayUnitPrice,
  getSaleActionLabel,
  applyPricebookToLineItems,
  generateLineItem,
  adjustSaleChange,
  adjustFromApi,
  applyChangeToLineItem,
  updateSaleByPaymentType,
  parkSale,
  discardSale,
  canSwitchSale,
  getPaymentMethodName,
  refineSalesTax,
  refineQkLayout,
  generateCashMovementsTableDatasource,
  generateSalesHistoryTableDatasource
} from './sale.logic';
import { SALE_IN_PROGRESS_ID } from './sale.constants';
import { getCurrentRegisterFromState } from '../register';
import { getOutletById } from '../outlet';
import pendingSaleManager from '../../modules/idb/managers/pending-sale-manager';
import PendingSale from '../../modules/idb/model/pending-sale';
import { openModal } from '../modal';
import ModalTypes from '../../constants/modalTypes';

export {
  calcRetailPrice,
  isSaleNotStarted,
  isSaleConfirmed,
  getLineItemDisplayPrice,
  getLineItemDisplayUnitPrice,
  getSaleActionLabel,
  generateCashMovementsTableDatasource,
  generateSalesHistoryTableDatasource,
  getPaymentMethodName,
  adjustFromApi
};

const initialState = {
  taxes: [],
  qkLayouts: [],
  closures: [],
  cashMovements: [],
  paymentMethods: [],
  receipts: [],
  payments: [],
  saleInProgress: {}
};

// ==================================
// Selectors
// ==================================
const saleReducerSelector = state => state.sale;

export const saleInProgressSelector = createSelector(
  saleReducerSelector,
  saleReducer => saleReducer.saleInProgress
);

export const isSalePristineSelector = createSelector(
  saleInProgressSelector,
  saleInProgress => saleInProgress.isPristine
);

export const taxesSelector = createSelector(saleReducerSelector, saleReducer =>
  saleReducer.taxes.map(tax => refineSalesTax(tax))
);

export const qkLayoutsSelector = createSelector(
  saleReducerSelector,
  saleReducer => saleReducer.qkLayouts.map(qkLayout => refineQkLayout(qkLayout))
);

export const closuresSelector = createSelector(
  saleReducerSelector,
  saleReducer => saleReducer.closures
);

export const cashMovementsSelector = createSelector(
  saleReducerSelector,
  saleReducer => saleReducer.cashMovements
);

export const paymentMethodsSelector = createSelector(
  saleReducerSelector,
  saleReducer => saleReducer.paymentMethods
);

export const paymentsSelector = createSelector(
  saleReducerSelector,
  saleReducer => saleReducer.payments
);

export const receiptsSelector = createSelector(
  saleReducerSelector,
  saleReducer => saleReducer.receipts
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('sale/RESET');

export const createSalesTax = createAction(
  'sale/CREATE_SALESTAX',
  ({ name, rate }) => {
    return request({
      url: '/taxes',
      method: 'post',
      body: { name, rate }
    });
  }
);

export const updateSalesTax = createAction('sale/UPDATE_SALESTAX', tax => {
  return request({
    url: `/taxes/${tax.id}`,
    method: 'put',
    body: { tax }
  });
});

export const deleteSalesTax = createAction('sale/DELETE_SALESTAX', id => {
  return request({
    url: `/taxes/${id}`,
    method: 'delete'
  });
});

export const fetchSalesTax = createAction('sale/FETCH_SALESTAX', () => {
  return request({
    url: '/taxes'
  });
});

export const fetchQkLayout = createAction('sale/FETCH_QKLAYOUT', filter => {
  return request({
    url: '/quickLayouts',
    params: filter
  });
});

export const createQkLayout = createAction('sale/CREATE_QKLAYOUT', qkLayout => {
  return request({
    url: '/quickLayouts',
    method: 'post',
    body: { qkLayout }
  });
});

export const updateQkLayout = createAction(
  'sale/UPDATE_QKLAYOUT',
  (id, qkLayout) => {
    return request({
      url: `/quickLayouts/${id}`,
      method: 'put',
      body: { qkLayout }
    });
  }
);

export const addQk = createAction('sale/ADD_QK', (layoutId, quickKey) => {
  return request({
    url: `/quickLayouts/${layoutId}/nodes`,
    method: 'post',
    body: { quickKey }
  });
});

export const fetchClosures = createAction(
  'sale/FETCH_CLOSURES',
  (registerId, filter) => {
    return request({
      url: `/registers/${registerId}/closures`,
      params: filter
    });
  }
);

export const openRegisterClosure = createAction(
  'sale/OPEN_CLOSURE',
  (registerId, closure) => {
    return request({
      url: `/registers/${registerId}/closures`,
      method: 'post',
      body: { closure }
    });
  }
);

export const closeRegisterClosure = createAction(
  'sale/CLOSE_CLOSURE',
  (registerId, closureId, countedCash, countedCreditCard) => {
    return request({
      url: `/registers/${registerId}/closures/${closureId}`,
      method: 'delete',
      body: { countedCash, countedCreditCard }
    });
  }
);

export const fetchCashMovements = createAction(
  'sale/FETCH_CASH_MOVEMENTS',
  (registerId, closureId) => {
    return request({
      url: `/registers/${registerId}/closures/${closureId}/cashMovements`
    });
  }
);

export const createCashMovement = createAction(
  'sale/CREATE_CASH_MOVEMENT',
  (registerId, closureId, cashMovement) => {
    return request({
      url: `/registers/${registerId}/closures/${closureId}/cashMovements`,
      method: 'post',
      body: { cashMovement }
    });
  }
);

export const fetchPaymentMethods = createAction(
  'sale/FETCH_PAYMENT_METHODS',
  filter => {
    return request({
      url: '/paymentMethods',
      params: filter
    });
  }
);

export const fetchPayments = createAction('sale/FETCH_PAYMENTS', filter => {
  return request({
    url: '/receipts/payments',
    params: filter
  });
});

const _addLineItem = createAction('sale/ADD_LINE_ITEM');

const _updateLineItem = createAction('sale/UPDATE_LINE_ITEM');

const _removeLineItem = createAction('sale/REMOVE_LINE_ITEM');

const _updateSale = createAction('sale/UPDATE');

const _updateSaleNote = createAction('sale/UPDATE_SALE_NOTE');

const _updateCustomer = createAction('sale/UPDATE_CUSTOMER');

export const updateTenderAmount = createAction('sale/UPDATE_TENDER_AMOUNT');

export const initializeSale = () => async dispatch => {
  const pendingSales = await pendingSaleManager.getAll();
  let activeSale = _.find(pendingSales, { id: SALE_IN_PROGRESS_ID });
  if (!activeSale) {
    activeSale = PendingSale.getInitial();
    await pendingSaleManager.insert(activeSale.id, activeSale);
  }
  return dispatch(
    _updateSale({
      ...activeSale,
      isPristine:
        typeof activeSale.isPristine === 'undefined'
          ? true
          : activeSale.isPristine
    })
  );
};

export const resetSale = () => (dispatch, getState) => {
  const saleInProgress = saleInProgressSelector(getState());
  pendingSaleManager.delete(saleInProgress.id);
  dispatch(initializeSale());
};

const propagateChanges = async (dispatch, getState) => {
  const updatedSale = adjustSaleChange(getState());
  await dispatch(_updateSale(updatedSale));
  pendingSaleManager.insert(updatedSale.id, updatedSale);
};

export const updateCustomer = customerId => async (dispatch, getState) => {
  await dispatch(_updateCustomer(customerId));
  const lineItems = applyPricebookToLineItems(getState());
  await dispatch(_updateSale({ lineItems }));
  propagateChanges(dispatch, getState);
};

export const addProductToSale = productId => async (dispatch, getState) => {
  const lineItem = generateLineItem(getState(), productId);
  await dispatch(_addLineItem(lineItem));
  propagateChanges(dispatch, getState);
};

export const removeLineItem = lineItemIndex => async (dispatch, getState) => {
  await dispatch(_removeLineItem({ lineItemIndex }));
  propagateChanges(dispatch, getState);
};

export const updateLineItem = (lineItemIndex, change) => async (
  dispatch,
  getState
) => {
  const lineItem = applyChangeToLineItem(getState(), lineItemIndex, change);
  await dispatch(_updateLineItem({ lineItemIndex, lineItem }));
  propagateChanges(dispatch, getState);
};

export const updateSaleDiscount = saleDiscount => async (
  dispatch,
  getState
) => {
  const snapshot = {};
  if (!saleDiscount) {
    snapshot.saleTotalDiscount = 0;
    snapshot.saleDiscountAmount = 0;
    snapshot.saleDiscountType = 'percent';
  } else if (saleDiscount.amount) {
    snapshot.saleDiscountAmount = parseFloat(saleDiscount.amount, 10);
  } else if (saleDiscount.type) {
    snapshot.saleDiscountType = saleDiscount.type;
  }

  await dispatch(_updateSale({ ...snapshot }));
  propagateChanges(dispatch, getState);
};

export const removeTax = tax => async (dispatch, getState) => {
  const saleInProgress = saleInProgressSelector(getState());
  const lineItems = saleInProgress.lineItems.map(lineItem => ({
    ...lineItem,
    saletaxId: lineItem.saletaxId === tax.saletaxId ? null : lineItem.saletaxId
  }));
  await dispatch(_updateSale({ lineItems }));
  propagateChanges(dispatch, getState);
};

export const updateSaleNote = saleNote => async (dispatch, getState) => {
  await dispatch(_updateSaleNote(saleNote));
  const saleInProgress = saleInProgressSelector(getState());
  pendingSaleManager.insert(saleInProgress.id, saleInProgress);
};

const createReceiptPayload = (state, nextSaleStatus, nextSaleSubStatus) => {
  const currentRegister = getCurrentRegisterFromState(state);
  const currentOutlet = getOutletById(state, currentRegister.outletId);
  const saleInProgress = saleInProgressSelector(state);
  return {
    receiptId: saleInProgress.receiptId,
    outletId: currentOutlet.outletId,
    customerId: saleInProgress.customerId,
    saleNote: saleInProgress.saleSafeNote,
    discountType: saleInProgress.saleDiscountType,
    discountAmount: saleInProgress.saleDiscountAmount,
    receiptDisc: saleInProgress.saleTotalDiscount,
    status: nextSaleStatus,
    subStatus: nextSaleSubStatus,
    lineItems: saleInProgress.lineItems,
    payments: saleInProgress.salePayments,
    closureId: currentRegister.openingClosureId
  };
};

export const fetchReceipts = createAction('sale/FETCH_RECEIPTS', filter => {
  return request({
    url: '/receipts',
    params: filter
  });
});

const createReceipt = createAction(
  'sale/CREATE_RECEIPT',
  (nextSaleStatus, nextSaleSubStatus) => (dispatch, getState) => {
    const payload = createReceiptPayload(
      getState(),
      nextSaleStatus,
      nextSaleSubStatus
    );
    return request({
      url: '/receipts',
      method: 'post',
      body: { receipt: payload }
    });
  }
);

const updateReceipt = createAction(
  'sale/UPDATE_RECEIPT',
  (nextSaleStatus, nextSaleSubStatus) => (dispatch, getState) => {
    const payload = createReceiptPayload(
      getState(),
      nextSaleStatus,
      nextSaleSubStatus
    );
    return request({
      url: `/receipts/${payload.receiptId}`,
      method: 'put',
      body: { receipt: payload }
    });
  }
);

const revertReceipt = createAction('sale/REVERT_RECEIPT', receiptId => {
  return request({
    url: `/receipts/${receiptId}`,
    method: 'post'
  });
});

const sendSaleToDatabase = async (result, dispatch, getState) => {
  if (result.shouldCreateReceipt) {
    await dispatch(
      createReceipt(result.nextSaleStatus, result.nextSaleSubStatus)
    );
    dispatch(resetSale());
  } else if (result.shouldUpdateReceipt) {
    await dispatch(
      updateReceipt(result.nextSaleStatus, result.nextSaleSubStatus)
    );
    dispatch(resetSale());
  } else {
    const saleInProgress = saleInProgressSelector(getState());
    pendingSaleManager.insert(saleInProgress.id, saleInProgress);
  }
};

export const pay = paymentMethodId => async (dispatch, getState) => {
  const result = updateSaleByPaymentType(getState(), paymentMethodId);
  await dispatch(_updateSale(result.updatedSale));
  sendSaleToDatabase(result, dispatch, getState);
};

export const park = () => (dispatch, getState) => {
  const result = parkSale(getState());
  sendSaleToDatabase(result, dispatch);
};

export const discard = () => (dispatch, getState) => {
  const result = discardSale(getState());
  if (result) {
    sendSaleToDatabase(result, dispatch);
  } else {
    dispatch(resetSale());
  }
};

export const fetchReceiptFromServerAndSyncStore = receiptId => async (
  dispatch,
  getState
) => {
  const result = await request({
    url: '/receipts',
    params: { ids: [receiptId] }
  });
  const receipt = result.data[0];
  const pendingSale = PendingSale.getInitial(receipt, getState());
  pendingSaleManager.insert(pendingSale.id, pendingSale);
};

export const switchSale = (receiptId, gotoWebregister) => async (
  dispatch,
  getState
) => {
  const result = canSwitchSale(getState(), receiptId);
  if (result.code === 'possible') {
    if (result.shouldFetchFromServer) {
      await dispatch(fetchReceiptFromServerAndSyncStore(receiptId));
      gotoWebregister();
    } else {
      gotoWebregister();
    }
  } else if (result.code === 'confirm') {
    dispatch(
      openModal({
        type: ModalTypes.SALE_CHANGE_CONFIRM,
        onReturnHandler: () => {
          gotoWebregister();
        },
        confirmHandler: async () => {
          await dispatch(park());
          await dispatch(fetchReceiptFromServerAndSyncStore(receiptId));
          gotoWebregister();
        }
      })
    );
  } else if (result.code === 'impossible') {
    dispatch(
      openModal({
        type: ModalTypes.MUST_RETURN_TO_SALE,
        confirmHandler: () => {
          gotoWebregister();
        }
      })
    );
  }
};

export const returnSale = (receiptId, gotoWebregister) => async dispatch => {
  const result = await dispatch(revertReceipt(receiptId));
  const revertedReceiptId = result.payload.data;
  dispatch(switchSale(revertedReceiptId, gotoWebregister));
};

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [_addLineItem]: (state, action) => {
    return {
      ...state,
      saleInProgress: {
        ...state.saleInProgress,
        lineItems: [...state.saleInProgress.lineItems, action.payload]
      }
    };
  },
  [_removeLineItem]: (state, action) => {
    const lineItems = state.saleInProgress.lineItems;
    return {
      ...state,
      saleInProgress: {
        ...state.saleInProgress,
        lineItems: [
          ...lineItems.slice(0, action.payload.lineItemIndex),
          ...lineItems.slice(action.payload.lineItemIndex + 1)
        ]
      }
    };
  },
  [_updateLineItem]: (state, action) => {
    const lineItems = state.saleInProgress.lineItems;
    return {
      ...state,
      saleInProgress: {
        ...state.saleInProgress,
        lineItems: [
          ...lineItems.slice(0, action.payload.lineItemIndex),
          action.payload.lineItem,
          ...lineItems.slice(action.payload.lineItemIndex + 1)
        ]
      }
    };
  },
  [_updateSale]: (state, action) => {
    return {
      ...state,
      saleInProgress: {
        ...state.saleInProgress,
        ...action.payload
      }
    };
  },
  [_updateCustomer]: (state, action) => {
    return {
      ...state,
      saleInProgress: {
        ...state.saleInProgress,
        customerId: action.payload
      }
    };
  },
  [_updateSaleNote]: (state, action) => {
    return {
      ...state,
      saleInProgress: {
        ...state.saleInProgress,
        saleSafeNote: action.payload
      }
    };
  },
  [updateTenderAmount]: (state, action) => {
    return {
      ...state,
      saleInProgress: {
        ...state.saleInProgress,
        tenderedAmount: action.payload
      }
    };
  },
  [createSalesTax]: {
    next: (state, action) => {
      const newTax = action.payload.data;
      return {
        ...state,
        taxes: [...state.taxes, newTax]
      };
    },
    throw: state => state
  },
  [fetchSalesTax]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        taxes: result.data
      };
    },
    throw: state => state
  },
  [updateSalesTax]: {
    next: (state, action) => {
      const updatedTax = action.payload.data;
      return {
        ...state,
        taxes: [
          ...state.taxes.filter(tax => tax.id !== updatedTax.id),
          updatedTax
        ]
      };
    },
    throw: state => state
  },
  [deleteSalesTax]: {
    next: (state, action) => {
      const deletedId = action.payload.data;
      return {
        ...state,
        taxes: state.taxes.filter(tax => tax.id !== deletedId)
      };
    },
    throw: state => state
  },
  [fetchQkLayout]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        qkLayouts: result.data
      };
    },
    throw: state => state
  },
  [createQkLayout]: {
    next: (state, action) => {
      const qkLayout = action.payload.data;
      return {
        ...state,
        qkLayouts: [...state.qkLayouts, qkLayout]
      };
    },
    throw: state => state
  },
  [updateQkLayout]: {
    next: (state, action) => {
      const qkLayout = action.payload.data;
      const index = _.findIndex(state.qkLayouts, {
        qkLayoutId: qkLayout.qkLayoutId
      });
      return {
        ...state,
        qkLayouts: [
          ...state.qkLayouts.slice(0, index),
          qkLayout,
          ...state.qkLayouts.slice(index + 1)
        ]
      };
    },
    throw: state => state
  },
  [addQk]: {
    next: (state, action) => {
      const newQk = action.payload.data;
      const layoutIndex = _.findIndex(state.qkLayouts, {
        qkLayoutId: newQk.qkLayoutId
      });
      const layout = state.qkLayouts[layoutIndex];
      return {
        ...state,
        qkLayouts: [
          ...state.qkLayouts.slice(0, layoutIndex),
          {
            ...layout,
            nodes: [...layout.nodes, newQk]
          },
          ...state.qkLayouts.slice(layoutIndex + 1)
        ]
      };
    },
    throw: state => state
  },
  [fetchClosures]: {
    next: (state, action) => {
      const closures = action.payload.data;
      return {
        ...state,
        closures
      };
    },
    throw: state => state
  },
  [openRegisterClosure]: {
    next: (state, action) => {
      const closure = action.payload.data;
      return {
        ...state,
        closures: [closure]
      };
    },
    throw: state => state
  },
  [closeRegisterClosure]: {
    next: (state, action) => {
      const closureId = action.payload.data;
      const index = _.findIndex(state.closures, { closureId });
      return {
        ...state,
        closures: [
          ...state.closures.slice(0, index),
          ...state.closures.slice(index + 1)
        ]
      };
    },
    throw: state => state
  },
  [fetchCashMovements]: {
    next: (state, action) => {
      const cashMovements = action.payload.data;
      return {
        ...state,
        cashMovements
      };
    },
    throw: state => state
  },
  [createCashMovement]: {
    next: (state, action) => {
      const newCashMovement = action.payload.data;
      return {
        ...state,
        cashMovements: [...state.cashMovements, newCashMovement]
      };
    },
    throw: state => state
  },
  [fetchPaymentMethods]: {
    next: (state, action) => {
      const paymentMethods = action.payload.data;
      return {
        ...state,
        paymentMethods
      };
    },
    throw: state => state
  },
  [fetchPayments]: {
    next: (state, action) => {
      const payments = action.payload.data;
      return {
        ...state,
        payments
      };
    },
    throw: state => state
  },
  [fetchReceipts]: {
    next: (state, action) => {
      const receipts = action.payload.data;
      return {
        ...state,
        receipts
      };
    },
    throw: state => state
  },
  [resetModule]: () => {
    return initialState;
  }
};

// ==================================
// Reducer
// ==================================
export default handleActions(ACTION_HANDLERS, initialState);
