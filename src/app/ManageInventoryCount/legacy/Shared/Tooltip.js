import React from 'react';
import classnames from 'classnames';

const Tooltip = ({ text, type, direction, children }) => (
  <div
    className={classnames('tooltip', {
      [`tooltip--${type}`]: !!type,
      [direction]: !!direction
    })}
  >
    {text}
    {children}
  </div>
);

export default Tooltip;
