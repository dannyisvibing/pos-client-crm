import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from '../utils/http';
import myLocalStorage from '../utils/localStorage';
import { SESSION_KEY } from '../constants/session';

const initialState = {
  session: null,
  loading: false,
  error: null
};

// ==================================
// Helpers
// ==================================
const setLocalSession = session => {
  return new Promise(resolve => {
    if (!session) {
      myLocalStorage.remove(SESSION_KEY);
      return resolve();
    }

    myLocalStorage.save(SESSION_KEY, session);
    return resolve(session);
  });
};

export const removeLocalSession = () => setLocalSession();

export const getLocalSessionSync = () => {
  return myLocalStorage.get(SESSION_KEY);
};

// ==================================
// Selectors
// ==================================
const sessionSelector = state => state.auth.session;

export const hasSessionSelector = state => !!sessionSelector(state);

export const userIdSelector = createSelector(
  sessionSelector,
  session => (session ? session.userId : null)
);

// ==================================
// Actions
// ==================================
export const loading = createAction('auth/LOADING');

export const login = createAction('auth/LOGIN', credentials => dispatch => {
  dispatch(loading());
  return request({
    method: 'post',
    url: '/auth/login',
    body: {
      username: credentials.username,
      password: credentials.password
    }
  });
});

export const resetModule = createAction('auth/RESET_SESSION', action => {
  removeLocalSession();
  return action;
});

export const logout = createAction('auth/LOGOUT', () => {
  return request({
    url: '/auth/logout'
  });
});

export const getSession = createAction('auth/GET_SESSION', credentials => {
  return request({
    method: 'post',
    url: '/auth/get-session',
    body: {
      username: credentials.username,
      password: credentials.password
    }
  });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [login]: {
    next: (state, action) => {
      const session = action.payload.data;
      setLocalSession(session);
      return {
        ...state,
        session,
        loading: false,
        error: null
      };
    },
    throw: state => ({
      ...state,
      error: null, // @todo: format http error
      session: null,
      loading: false
    })
  },

  [logout]: {
    next: state => {
      resetModule();
      // @todo: Intercom shutdown
      return {
        ...state,
        session: null,
        loading: false,
        error: null
      };
    },
    throw: state => state
  },

  [resetModule]: () => {
    // @todo: Intercom shutdown
    return initialState;
  },

  [loading]: state => ({
    ...state,
    loading: true
  }),

  [getSession]: {
    next: (state, action) => {
      const session = action.payload.data;
      setLocalSession(session);
      return state;
    },
    throw: state => state
  }
};

// ==================================
// Reducer
// ==================================
export default handleActions(ACTION_HANDLERS, initialState);
