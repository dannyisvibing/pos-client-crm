import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { i18nReducer } from 'react-redux-i18n';
import i18nLoaderReducer from '../modules/i18n';
import appReducer from '../modules/app';
import authReducer from '../modules/auth';
import userReducer from '../modules/user';
import productReducer from '../modules/product';
import pricebookReducer from '../modules/pricebook';
import customerReducer from '../modules/customer';
import outletReducer from '../modules/outlet';
import registerReducer from '../modules/register';
import retailerReducer from '../modules/retailer';
import saleReducer from '../modules/sale';
import modalReducer from '../modules/modal';

export const makeRootReducer = asyncReducers => {
  const reducers = {
    router: routerReducer,
    i18n: i18nReducer,
    i18nLoader: i18nLoaderReducer,
    app: appReducer,
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    pricebook: pricebookReducer,
    customer: customerReducer,
    outlet: outletReducer,
    register: registerReducer,
    retailer: retailerReducer,
    sale: saleReducer,
    modal: modalReducer,
    ...asyncReducers
  };
  return combineReducers(reducers);
};

export default makeRootReducer;
