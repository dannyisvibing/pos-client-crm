import { createAction, handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from '../../utils/http';
import {
  getPageToRenderFromRouteParam,
  getPricebookById,
  refinePricebook,
  refinePricebookItem
} from './pricebook.logic';

export {
  getPageToRenderFromRouteParam,
  getPricebookById,
  refinePricebook,
  refinePricebookItem
};

const initialState = {
  pricebooks: []
};

// ==================================
// Selectors
// ==================================
const pricebookReducerSelector = state => state.pricebook;

export const pricebooksSelector = createSelector(
  pricebookReducerSelector,
  pricebookReducer => {
    return pricebookReducer.pricebooks.map(pricebook =>
      refinePricebook(pricebook)
    );
  }
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('pricebook/RESET');

export const fetchPricebooks = createAction('pricebook/FETCH', filter => {
  return request({
    url: '/pricebooks',
    params: filter
  });
});

export const createPricebook = createAction('pricebook/CREATE', pricebook => {
  return request({
    url: '/pricebooks',
    method: 'post',
    body: { pricebook }
  });
});

export const updatePricebook = createAction('pricebook/UPDATE', pricebook => {
  return request({
    url: `/pricebooks/${pricebook.bookId}`,
    method: 'put',
    body: { pricebook }
  });
});

export const deletePricebook = createAction('pricebook/DELETE', id => {
  return request({
    url: `/pricebooks/${id}`,
    method: 'delete'
  });
});

export const duplicatePricebook = createAction('pricebook/DUPLICATE', id => {
  return request({
    url: `/pricebooks/${id}`,
    method: 'post'
  });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [fetchPricebooks]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        pricebooks: result.data
      };
    },
    throw: state => state
  },
  [combineActions(createPricebook, duplicatePricebook)]: {
    next: (state, action) => {
      const newPricebook = action.payload.data;
      return {
        ...state,
        pricebooks: [...state.pricebooks, newPricebook]
      };
    },
    throw: state => state
  },
  [updatePricebook]: {
    next: (state, action) => {
      const updatedPricebook = action.payload.data;
      return {
        ...state,
        pricebooks: [
          ...state.pricebooks.filter(
            pricebook => pricebook.bookId !== updatedPricebook.bookId
          ),
          updatedPricebook
        ]
      };
    },
    throw: state => state
  },
  [deletePricebook]: {
    next: (state, action) => {
      const deletedId = action.payload.data;
      return {
        ...state,
        pricebooks: state.pricebooks.filter(
          pricebook => pricebook.bookId !== deletedId
        )
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
