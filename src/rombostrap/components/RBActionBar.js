import React from 'react';
import classnames from 'classnames';

const RBActionBar = ({ classes, inline, children }) => (
  <div
    className={classnames('vd-action-bar', classes, {
      'vd-action-bar--inline': inline
    })}
  >
    {children}
  </div>
);

export default RBActionBar;
