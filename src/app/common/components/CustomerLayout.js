import React from 'react';
import PropTypes from 'prop-types';
import CustomerSidebar from '../containers/CustomerSidebarContainer';
import { logRender } from '../../../utils/debug';

const CustomerLayout = ({ children }) => {
  logRender('render CustomerLayout');
  return (
    <div className="vd-content-container">
      <CustomerSidebar />
      <div className="vd-content-main-container">{children}</div>
    </div>
  );
};

const { any } = PropTypes;
CustomerLayout.propTypes = {
  children: any.isRequired
};

export default CustomerLayout;
