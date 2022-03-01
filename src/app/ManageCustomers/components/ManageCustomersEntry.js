import React from 'react';
import PropTypes from 'prop-types';
import { logRender } from '../../../utils/debug';
import { MANAGE_CUSTOMERS } from '../../../constants/pageTags';
import CustomersHomePage from '../containers/CustomersHomePageContainer';
import CRUDCustomersPage from '../containers/CRUDCustomersPageContainer';
import ImportCustomersPage from '../containers/ImportCustomersPageContainer';

const ManageCustomersEntry = ({ page }) => {
  logRender('render Manage Customers Entry');
  return page.tag === MANAGE_CUSTOMERS.HOME ? (
    <CustomersHomePage />
  ) : page.tag === MANAGE_CUSTOMERS.CRUD ? (
    <CRUDCustomersPage params={page.props} />
  ) : page.tag === MANAGE_CUSTOMERS.IMPORT ? (
    <ImportCustomersPage />
  ) : (
    <div />
  );
};

const { object } = PropTypes;
ManageCustomersEntry.propTypes = {
  page: object.isRequired
};

export default ManageCustomersEntry;
