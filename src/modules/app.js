import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { goBack, replace, push } from 'react-router-redux';
import queryString from 'query-string';

const initialState = {
  prevModuleTag: '',
  prevPageTag: ''
};

// ==================================
// Selectors
// ==================================
const appReducerSelector = state => state.app;

export const isModuleLoadingSelector = moduleTag =>
  createSelector(
    appReducerSelector,
    appReducer => appReducer.prevModuleTag !== moduleTag
  );

export const isPageLoadingSelector = pageTag =>
  createSelector(
    appReducerSelector,
    appReducer => appReducer.prevPageTag !== pageTag
  );

export const currentPageTagSelector = createSelector(
  appReducerSelector,
  appReducer => appReducer.prevPageTag
);

const routerReducerSelector = state => state.router;

export const locationSearchSelector = createSelector(
  routerReducerSelector,
  routerReducer => queryString.parse(routerReducer.location.search)
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('app/RESET');

export const setModuleLoaded = createAction('app/MODULE_LOADED');

export const setPageLoaded = createAction('app/PAGE_LOADED');

export const routerGoBack = createAction(
  'app/ROUTER_GOBACK',
  () => dispatch => {
    dispatch(goBack());
  }
);

export const routerPush = createAction('app/ROUTER_PUSH', path => dispatch => {
  dispatch(push(path));
});

export const routerReplace = createAction(
  'app/ROUTER_REPLACE',
  path => dispatch => {
    dispatch(replace(path));
  }
);

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [setModuleLoaded]: (state, action) => ({
    ...state,
    prevModuleTag: action.payload
  }),
  [setPageLoaded]: (state, action) => ({
    ...state,
    prevPageTag: action.payload
  }),
  [resetModule]: () => {
    return initialState;
  }
};

// ==================================
// Reducer
// ==================================
export default handleActions(ACTION_HANDLERS, initialState);
