import request from '../../utils/http';
import {
  RETAILER_SETTINGS,
  RETAILER_CONTACT,
  RECEIPT_TEMPLATE,
  refine
} from '../../constants/entityModels';
import WindowDelegate from '../../rombostrap/utils/windowDelegate';
import { settingsManager } from '../idb/managers';

export const refineRetailerContact = (raw = {}) =>
  refine(RETAILER_CONTACT, raw);

export const refineRetailerSettings = (raw = {}) =>
  refine(RETAILER_SETTINGS, raw);

export const refineReceiptTemplate = (raw = {}) =>
  refine(RECEIPT_TEMPLATE, raw);

export const fetchRetailer = async () => {
  const windowDelegate = WindowDelegate.getInstance();
  if (windowDelegate.isOnline()) {
    const response = await request({
      url: '/retailer'
    });
    const retailer = response.data;
    settingsManager.insert('RETAILER_SETTINGS', retailer.settings);
    return retailer;
  } else {
    const settings = await settingsManager.get('RETAILER_SETTINGS');
    return { contact: {}, settings };
  }
};
