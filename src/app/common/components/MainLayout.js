import React from 'react';
import PropTypes from 'prop-types';
import AppHeader from '../containers/AppHeaderContainer';
import AppSidebar from '../containers/AppSidebarContainer';
import { logRender } from '../../../utils/debug';

const MainLayout = ({ children }) => {
  logRender('render MainLayout');
  return (
    <div className="vd-body">
      <AppHeader />
      <AppSidebar />
      {children}
    </div>
  );
};

const { any } = PropTypes;
MainLayout.propTypes = {
  children: any.isRequired
};

export default MainLayout;
