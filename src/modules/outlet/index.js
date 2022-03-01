import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from '../../utils/http';
import { refineOutlet, getMyOutlets, getOutletById } from './outlet.logic';

export { getOutletById };

const initialState = {
  outlets: [],
  loading: false,
  error: null
};

// ==================================
// Selectors
// ==================================
const outletReducerSelector = state => state.outlet;

export const outletsSelector = createSelector(
  outletReducerSelector,
  outletReducer => outletReducer.outlets.map(outlet => refineOutlet(outlet))
);

export const myOutletsSelector = getMyOutlets;

// ==================================
// Actions
// ==================================
export const resetModule = createAction('outlet/RESET');

export const fetchOutlets = createAction('outlet/FETCH', () => {
  return request({
    url: '/outlets'
  });
});

export const createOutlet = createAction('outlet/CREATE', outlet => {
  return request({
    url: '/outlets',
    method: 'post',
    body: { outlet }
  });
});

export const updateOutlet = createAction('outlet/UPDATE', outlet => {
  return request({
    url: `/outlets/${outlet.outletId}`,
    method: 'put',
    body: { outlet }
  });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [fetchOutlets]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        outlets: result.data
      };
    },
    throw: state => state
  },
  [createOutlet]: {
    next: (state, action) => {
      const newOutlet = action.payload.data;
      return {
        ...state,
        outlets: [...state.outlets, newOutlet]
      };
    },
    throw: state => state
  },
  [updateOutlet]: {
    next: (state, action) => {
      const updatedOutlet = action.payload.data;
      return {
        ...state,
        outlets: [
          ...state.outlets.filter(
            outlet => outlet.outletId !== updatedOutlet.outletId
          ),
          updatedOutlet
        ]
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
