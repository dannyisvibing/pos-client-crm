import request from '../../utils/http';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import { MANAGE_CUSTOMERS } from '../../constants/pageTags';
import CountryCode from '../../constants/countryCodes';
import { CUSTOMER, CUSTOMER_GROUP, refine } from '../../constants/entityModels';
import { customersSelector, customerGroupsSelector } from './index';
import WindowDelegate from '../../rombostrap/utils/windowDelegate';
import { customersManager, customerGroupsManager } from '../idb/managers';

export const fetchCustomers = async filter => {
  const windowDelegate = WindowDelegate.getInstance();
  if (windowDelegate.isOnline()) {
    const response = await request({
      url: '/customers',
      params: filter
    });
    const result = response.data;
    return result.data;
  } else {
    return customersManager.getAll();
  }
};

export const fetchCustomerGroups = async () => {
  const windowDelegate = WindowDelegate.getInstance();
  if (windowDelegate.isOnline()) {
    const response = await request({
      url: '/customerGroups'
    });
    const result = response.data;
    return result.data;
  } else {
    return customerGroupsManager.getAll();
  }
};

export const getPageToRenderFromRouteParam = ({ action, id }) => {
  if (!action && !id) {
    return { tag: MANAGE_CUSTOMERS.HOME };
  } else if (action === 'import' && !id) {
    return { tag: MANAGE_CUSTOMERS.IMPORT };
  } else if (action === 'edit' && !!id) {
    return {
      tag: MANAGE_CUSTOMERS.CRUD,
      props: { edit: true, customerId: id }
    };
  } else if (action === 'add' && !id) {
    return {
      tag: MANAGE_CUSTOMERS.CRUD,
      props: { create: true }
    };
  }
};

export const generateCustomersTableDatasource = (customers, customerGroups) => {
  return customers.reduce((memo, customer) => {
    const country = CountryCode.find(
      country => country.code === customer.physicalCountry
    ) || { name: '-' };
    const customerGroup =
      _.find(
        customerGroups,
        customerGroup => customerGroup.id === customer.customerGroupId
      ) || {};

    memo.push({
      id: customer.id,
      company: customer.company,
      name: `${customer.firstname} ${customer.lastname}`,
      customerGroup: customerGroup.name || '',
      code: customer.code,
      location: country.name,
      storeCredit: customer.storeCredit || 0,
      account: customer.accountBalance || 0,
      loyalty: customer.loyalty || 0,
      totalSpent: customer.totalSpent || 0,
      last12Months: customer.last12Month || 0,
      totalEarnedLoyalty: customer.totalEarnedLoyalty || 0,
      totalRedeemedLoyalty: customer.totalRedeemedLoyalty || 0,
      totalIssuedStoreCredit: customer.totalIssuedStoreCredit || 0,
      totalRedeemedStoreCredit: customer.totalRedeemedStoreCredit || 0,
      sex: customer.sex || '-',
      birthday: customer.birthday
        ? moment(customer.birthday).format('DD MMMM YYYY')
        : '-',
      postalAddress: country.name,
      physicalAddress: country.name
    });

    return memo;
  }, []);
};

export const refineCustomer = (raw = {}) => refine(CUSTOMER, raw);

export const refineCustomerGroup = (raw = {}) => refine(CUSTOMER_GROUP, raw);

export const getFilterFromLocationSearch = search => {
  return {
    name: search.name || '',
    customerGroupId: search.customerGroupId || '',
    city: search.city || '',
    countryCode: search.countryCode || '',
    createdAt: search.createdAt ? moment(search.createdAt).toDate() : ''
  };
};

export const getLocationSearchFromFilter = filter => {
  return queryString.stringify({ ...filter });
};

export const getHttpReqParamFromFilter = filter => {
  return { ...filter };
};

export const getCustomerGroupById = (state, id) => {
  const initialCustomerGroup = refineCustomerGroup();
  if (!id) return initialCustomerGroup;
  const customerGroups = customerGroupsSelector(state);
  return _.find(customerGroups, { id }) || initialCustomerGroup;
};

export const getCustomerById = (state, id) => {
  const initialCustomer = refineCustomer();
  if (!id) return initialCustomer;
  const customers = customersSelector(state);
  return _.find(customers, { id }) || initialCustomer;
};
