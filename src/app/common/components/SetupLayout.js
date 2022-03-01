import React from 'react';
import PropTypes from 'prop-types';
import SetupSidebar from '../containers/SetupSidebarContainer';
import { logRender } from '../../../utils/debug';

const SetupLayout = ({ children }) => {
  logRender('render SetupLayout');
  return (
    <div className="vd-content-container">
      <SetupSidebar />
      <div className="vd-content-main-container">{children}</div>
    </div>
  );
};

const { any } = PropTypes;
SetupLayout.propTypes = {
  children: any.isRequired
};

export default SetupLayout;
