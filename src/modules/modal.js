import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import ModalTypes from '../constants/modalTypes';

const initialState = {
  [ModalTypes.PRODUCT_TYPES]: {},
  [ModalTypes.PRODUCT_BRANDS]: {},
  [ModalTypes.PRODUCT_SUPPLIERS]: {},
  [ModalTypes.PRODUCT_TAGS]: {},
  [ModalTypes.WARN_PERMANENT_ACTION]: {},
  [ModalTypes.CUSTOMER_GROUP]: {},
  [ModalTypes.SELECT_VARIANT]: {},
  [ModalTypes.PAY_PANEL]: {},
  [ModalTypes.WARN_LOST_SALE]: {},
  [ModalTypes.WARN_NO_SALE_NOTE]: {},
  [ModalTypes.SALE_CHANGE_CONFIRM]: {},
  [ModalTypes.MUST_RETURN_TO_SALE]: {},
  [ModalTypes.SELECT_REGISTER]: {},
  [ModalTypes.OFFLINE_NOTIFICATION]: {},
  [ModalTypes.RIGHT_SIDEBAR]: {},
  [ModalTypes.SWITCH_DIALOG]: {},
  [ModalTypes.CONFIRM_USER_SWITCH]: {}
};

// ==================================
// Selectors
// ==================================
const modalReducerSelector = state => state.modal;

export const isModalOpenSelector = type =>
  createSelector(
    modalReducerSelector,
    modalReducer => modalReducer[type].isOpen
  );

export const optionsSelector = type =>
  createSelector(
    modalReducerSelector,
    modalReducer => modalReducer[type].options || {}
  );

// ==================================
// Actions
// ==================================
export const openModal = createAction('modal/OPEN');

export const closeModal = createAction('modal/CLOSE');

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [openModal]: (state, action) => {
    const { type, ...options } = action.payload;
    return {
      ...state,
      [type]: {
        isOpen: true,
        options
      }
    };
  },
  [closeModal]: (state, action) => ({
    ...state,
    [action.payload]: { isOpen: false }
  })
};

// ==================================
// Reducer
// ==================================
export default handleActions(ACTION_HANDLERS, initialState);
