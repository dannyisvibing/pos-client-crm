import React from 'react';
import classnames from 'classnames';

const RBField = ({ classes, short, flex, children }) => (
  <div
    className={classnames('vd-field', classes, {
      'vd-field--short': short,
      'vd-flex': flex
    })}
  >
    {children}
  </div>
);

export const RBLabel = ({ classes, children }) => (
  <div className={classnames('vd-label', classes)}>{children}</div>
);

export const RBValue = ({ classes, flex, children }) => (
  <div
    className={classnames('vd-value', classes, {
      'vd-flex': flex
    })}
  >
    {children}
  </div>
);

export default RBField;
