import React from 'react';
import classnames from 'classnames';

const RBP = ({ classes, children }) => (
  <p className={classnames('vd-p', classes)}>{children}</p>
);

export default RBP;
