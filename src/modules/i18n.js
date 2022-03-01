import { createAction, handleActions } from 'redux-actions';
import { setLocale, loadTranslations } from 'react-redux-i18n';
import moment from 'moment-timezone';
import { getStatic } from '../utils/http';

// =================================
// Helpers
// =================================
const getDefaultLocale = () => {
  return 'en';
};

// =================================
// Selectors
// =================================
export const availableLocalesSelector = state =>
  state.i18n && state.i18n.translations
    ? Object.keys(state.i18n.translations)
    : [];

// =================================
// Actions
// =================================
export const loading = createAction('i18n/LOADING');

export const updateLocale = createAction(
  'i18n/UPDATE_LOCALE',
  (locale = getDefaultLocale()) => dispatch => {
    dispatch(loading());
    let url = `locales/${locale}.json`;
    return getStatic({ url }).then(translations => {
      const translationsObject = {
        [locale]: translations
      };
      dispatch(loadTranslations(translationsObject));
      dispatch(setLocale(locale));
      moment.locale(locale);
      return translations;
    });
  }
);

// =================================
// Action Handlers
// =================================
const ACTION_HANDLERS = {
  [updateLocale]: {
    next: state => ({
      ...state,
      loading: false,
      error: null
    }),
    throw: (state, action) => {
      let error;
      if (action.payload.response) {
        const data = action.payload.response.data;
        error = {
          status: action.payload.response.status,
          statusText: action.payload.response.statusText,
          message: (data && data.error_message) || data
        };
        return {
          ...state,
          error,
          loading: false
        };
      }
      throw action.payload;
    }
  },

  [loading]: state => ({
    ...state,
    loading: true
  })
};

// =================================
// Reducer
// =================================
const initialState = {
  loading: false,
  error: null
};

export default handleActions(ACTION_HANDLERS, initialState);
