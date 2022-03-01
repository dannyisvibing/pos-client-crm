import React from 'react';
import classnames from 'classnames';

const Scrollable = ({ classes, children }) => (
  <div className={classnames('vd-scrollable-container', classes)}>
    <div className="vd-scrollable-indicator vd-scrollable-monobrow" />
    <div className="vd-scrollable">{children}</div>
    <div className="vd-scrollable-indicator vd-scrollable-goatee" />
  </div>
);

export default Scrollable;
