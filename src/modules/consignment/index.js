import { createAction, handleActions } from 'redux-actions';
import request from '../../utils/http';
import { getPageToRenderFromRouteParam } from './consignment.logic';

export { getPageToRenderFromRouteParam };

const initialState = {};

// ==================================
// Selectors
// ==================================
// const consignmentReducerSelector = state => state.consignment;

// ==================================
// Actions
// ==================================
export const resetModule = createAction('consignment/RESET');

export const fetchConsignments = createAction('consignment/FETCH', filter => {
  return request({
    url: '/consignments',
    params: { params: filter }
  });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [resetModule]: () => {
    return initialState;
  }
};

// ==================================
// Reducer
// ==================================
export default handleActions(ACTION_HANDLERS, initialState);
