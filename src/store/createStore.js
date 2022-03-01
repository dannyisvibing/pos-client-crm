import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware, replace as replaceRoute } from 'react-router-redux';
import reduxThunkFsa from 'redux-thunk-fsa';
import promiseMiddleware from 'redux-promise';
import { syncTranslationWithStore } from 'react-redux-i18n';
import { createLogger } from 'redux-logger';
import { init as initAxios } from '../utils/http';
import makeRootReducer from './reducers';
import { resetModule as resetAuthModule } from '../modules/auth';
import { resetModule as resetAppModule } from '../modules/app';
import { resetModule as resetConsignmentModule } from '../modules/consignment';
import { resetModule as resetCustomerModule } from '../modules/customer';
import { resetModule as resetOutletModule } from '../modules/outlet';
import { resetModule as resetPricebookModule } from '../modules/pricebook';
import { resetModule as resetProductModule } from '../modules/product';
import { resetModule as resetRegisterModule } from '../modules/register';
import { resetModule as resetRetailerModule } from '../modules/retailer';
import { resetModule as resetSaleModule } from '../modules/sale';
import { resetModule as resetUserModule } from '../modules/user';

export default (initialState = {}, history) => {
  let ENV = process.env.REACT_APP_ENV;
  // ========================================
  // Middleware Configuration
  // ========================================
  const middleware = [
    reduxThunkFsa,
    promiseMiddleware,
    routerMiddleware(history)
  ];
  if (ENV !== 'production') {
    middleware.push(createLogger({ collapsed: true, duration: true }));
  }

  // ========================================
  // Store Enhancers
  // ========================================
  const enhancers = [];
  let composeEnhancers = compose;

  if (ENV !== 'production') {
    const composeWithDevToolsExtension =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  // ========================================
  // Store Instantiation and HMR Setup
  // ========================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(applyMiddleware(...middleware), ...enhancers)
  );

  store.asyncReducers = {};

  const dispatch = store.dispatch;
  const onUnAuthCb = () => {
    store.dispatch(
      replaceRoute({
        pathname: '/login',
        state: {
          force: true
        }
      })
    );
    dispatch(resetAuthModule());
    dispatch(resetAppModule());
    dispatch(resetConsignmentModule());
    dispatch(resetCustomerModule());
    dispatch(resetOutletModule());
    dispatch(resetPricebookModule());
    dispatch(resetProductModule());
    dispatch(resetRegisterModule());
    dispatch(resetRetailerModule());
    dispatch(resetSaleModule());
    dispatch(resetUserModule());
  };
  initAxios(store, onUnAuthCb);
  syncTranslationWithStore(store);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextMakeRootReducer = require('./reducers').default;
      store.replaceReducer(nextMakeRootReducer(store.asyncReducers));
    });
  }

  return store;
};
