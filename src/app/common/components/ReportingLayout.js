import React from 'react';
import PropTypes from 'prop-types';
import ReportingSidebar from '../containers/ReportingSidebarContainer';
import { logRender } from '../../../utils/debug';

const ReportingLayout = ({ children }) => {
  logRender('render ReportingLayout');
  return (
    <div className="vd-content-container">
      <ReportingSidebar />
      <div className="vd-content-main-container">{children}</div>
    </div>
  );
};

const { any } = PropTypes;
ReportingLayout.propTypes = {
  children: any.isRequired
};

export default ReportingLayout;
