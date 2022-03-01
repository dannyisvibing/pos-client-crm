import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from '../../utils/http';
import {
  refineRegister,
  getCurrentRegisterFromState,
  getCurrentRegisterFromApi,
  getRegisterById,
  setCurrentRegister
} from './register.logic';

export {
  getRegisterById,
  getCurrentRegisterFromState,
  getCurrentRegisterFromApi,
  setCurrentRegister
};

const initialState = {
  registers: []
};

// ==================================
// Selectors
// ==================================
const registerReducerSelector = state => state.register;

export const registersSelector = createSelector(
  registerReducerSelector,
  registerReducer =>
    registerReducer.registers.map(register => refineRegister(register))
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('register/RESET');

export const fetchRegisters = createAction('register/FETCH', filter => {
  return request({
    url: '/registers',
    params: filter
  });
});

export const createRegister = createAction('register/CREATE', register => {
  return request({
    url: '/registers',
    method: 'post',
    body: { register }
  });
});

export const updateRegister = createAction(
  'register/UPDATE',
  (id, register) => {
    return request({
      url: `/registers/${id}`,
      method: 'put',
      body: { register }
    });
  }
);

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [fetchRegisters]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        registers: result.data
      };
    },
    throw: state => state
  },
  [createRegister]: {
    next: (state, action) => {
      const newRegister = action.payload.data;
      return {
        ...state,
        registers: [...state.registers, newRegister]
      };
    }
  },
  [updateRegister]: {
    next: (state, action) => {
      const updatedRegister = action.payload.data;
      return {
        ...state,
        registers: [
          ...state.registers.filter(
            register => register.registerId !== updatedRegister.registerId
          ),
          updatedRegister
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
