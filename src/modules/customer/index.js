import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import request from '../../utils/http';
import { locationSearchSelector } from '../app';
import {
  fetchCustomers as _fetchCustomers,
  fetchCustomerGroups as _fetchCustomerGroups,
  getPageToRenderFromRouteParam,
  getLocationSearchFromFilter,
  getHttpReqParamFromFilter,
  getFilterFromLocationSearch,
  generateCustomersTableDatasource,
  refineCustomer,
  refineCustomerGroup,
  getCustomerById,
  getCustomerGroupById
} from './customer.logic';

export {
  getPageToRenderFromRouteParam,
  generateCustomersTableDatasource,
  getCustomerById,
  getCustomerGroupById
};

const initialState = {
  filter: {},
  customers: [],
  customerGroups: []
};

// ==================================
// Selectors
// ==================================
const customerReducerSelector = state => state.customer;

export const filterSelector = createSelector(
  customerReducerSelector,
  customerReducer => customerReducer.filter
);

export const customersSelector = createSelector(
  customerReducerSelector,
  customerReducer => {
    return customerReducer.customers.map(customer => refineCustomer(customer));
  }
);

export const customerGroupsSelector = createSelector(
  customerReducerSelector,
  customerReducer => {
    return customerReducer.customerGroups.map(customerGroup =>
      refineCustomerGroup(customerGroup)
    );
  }
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('customer/RESET');

export const setFilter = createAction('customer/SET_FILTER');

export const createCustomer = createAction('customer/CREATE', customer => {
  return request({
    url: '/customers',
    method: 'post',
    body: { customer }
  });
});

export const updateCustomer = createAction('customer/UPDATE', customer => {
  return request({
    url: `/customers/${customer.id}`,
    method: 'put',
    body: { customer }
  });
});

export const deleteCustomer = createAction('customer/DELETE', id => {
  return request({
    url: `/customers/${id}`,
    method: 'delete'
  });
});

export const createCustomerGroup = createAction(
  'customer/CREATE_GROUP',
  name => {
    return request({
      url: '/customerGroups',
      method: 'post',
      body: { name }
    });
  }
);

export const applyFilter = createAction(
  'customer/APPLY_FILTER',
  () => (dispatch, getState) => {
    const filter = filterSelector(getState());
    const locationSearch = getLocationSearchFromFilter(filter);
    dispatch(push('/customer?' + locationSearch));
    dispatch(fetchCustomers(getHttpReqParamFromFilter(filter)));
  }
);

export const applyFilterFromUrl = createAction(
  'customer/APPLY_FILTER_FROM_URL',
  () => (dispatch, getState) => {
    const locationSearch = locationSearchSelector(getState());
    const filter = getFilterFromLocationSearch(locationSearch);
    dispatch(setFilter(filter));
    dispatch(fetchCustomers(getHttpReqParamFromFilter(filter)));
  }
);

export const fetchCustomers = createAction('customer/FETCH', _fetchCustomers);

export const fetchCustomerGroups = createAction(
  'customer/FETCH_GROUPS',
  _fetchCustomerGroups
);

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [setFilter]: (state, action) => ({
    ...state,
    filter: {
      ...state.filter,
      ...action.payload
    }
  }),
  [createCustomer]: {
    next: (state, action) => {
      const newCustomer = action.payload.data;
      return {
        ...state,
        customers: [...state.customers, newCustomer]
      };
    },
    throw: state => state
  },
  [updateCustomer]: {
    next: (state, action) => {
      const updatedCustomer = action.payload.data;
      return {
        ...state,
        customers: [
          ...state.customers.filter(
            customer => customer.id !== updatedCustomer.id
          ),
          updatedCustomer
        ]
      };
    },
    throw: state => state
  },
  [deleteCustomer]: {
    next: (state, action) => {
      const deletedId = action.payload.data;
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== deletedId)
      };
    },
    throw: state => state
  },
  [fetchCustomers]: {
    next: (state, action) => {
      return {
        ...state,
        customers: action.payload
      };
    },
    throw: state => state
  },
  [createCustomerGroup]: {
    next: (state, action) => {
      const newCustomerGroup = action.payload.data;
      return {
        ...state,
        customerGroups: [...state.customerGroups, newCustomerGroup]
      };
    },
    throw: state => state
  },
  [fetchCustomerGroups]: {
    next: (state, action) => {
      return {
        ...state,
        customerGroups: action.payload
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
