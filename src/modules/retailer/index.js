import { createAction, handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from '../../utils/http';
import {
  fetchRetailer as _fetchRetailer,
  refineRetailerContact,
  refineRetailerSettings,
  refineReceiptTemplate
} from './retailer.logic';

const initialState = {
  contact: {},
  settings: {},
  receiptTemplates: []
};

// ==================================
// Selectors
// ==================================
const retailerReducerSelector = state => state.retailer;

export const retailerSelector = createSelector(
  retailerReducerSelector,
  retailerReducer => ({
    contact: refineRetailerContact(retailerReducer.contact),
    settings: refineRetailerSettings(retailerReducer.settings)
  })
);

export const retailerContactSelector = createSelector(
  retailerReducerSelector,
  retailerReducer => {
    return refineRetailerContact(retailerReducer.contact);
  }
);

export const retailerSettingsSelector = createSelector(
  retailerReducerSelector,
  retailerReducer => {
    return refineRetailerSettings(retailerReducer.settings);
  }
);

export const receiptTemplatesSelector = createSelector(
  retailerReducerSelector,
  retailerReducer => {
    return retailerReducer.receiptTemplates.map(receiptTemplate =>
      refineReceiptTemplate(receiptTemplate)
    );
  }
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('retailer/RESET');

export const fetchRetailer = createAction('retailer/FETCH', _fetchRetailer);

export const updateRetailerContact = createAction(
  'retailer/UPDATE_CONTACT',
  contact => {
    return request({
      url: '/retailer',
      method: 'put',
      body: { contact }
    });
  }
);

export const updateRetailerSettings = createAction(
  'retailer/UPDATE_SETTINGS',
  settings => {
    return request({
      url: '/retailer',
      method: 'put',
      body: { settings }
    });
  }
);

export const fetchReceiptTemplates = createAction(
  'retailer/FETCH_RECEIPT_TEMPLATES',
  filters => {
    return request({
      url: '/receiptTemplates',
      params: filters
    });
  }
);

export const createReceiptTemplate = createAction(
  'retailer/CREATE_RECEIPT_TEMPLATE',
  template => {
    return request({
      url: '/receiptTemplates',
      method: 'post',
      body: { template }
    });
  }
);

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [fetchRetailer]: {
    next: (state, action) => {
      const retailer = action.payload;
      // @tricky
      window.defaultCurrency = retailer.settings.defaultCurrency;
      return {
        contact: retailer.contact,
        settings: retailer.settings
      };
    },
    throw: state => state
  },
  [combineActions(updateRetailerContact, updateRetailerSettings)]: {
    next: (state, action) => {
      const retailer = action.payload.data;
      // @tricky
      window.defaultCurrency = retailer.settings.defaultCurrency;
      return {
        contact: retailer.contact,
        settings: retailer.settings
      };
    },
    throw: state => state
  },
  [fetchReceiptTemplates]: {
    next: (state, action) => {
      const receiptTemplates = action.payload.data;
      return {
        ...state,
        receiptTemplates
      };
    },
    throw: state => state
  },
  [createReceiptTemplate]: {
    next: (state, action) => {
      const newTemplate = action.payload.data;
      return {
        ...state,
        receiptTemplates: [...state.receiptTemplates, newTemplate]
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
