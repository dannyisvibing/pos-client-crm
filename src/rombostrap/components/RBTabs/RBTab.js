import React from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

const RBTab = ({
  classes,
  activeValue,
  active,
  link,
  type,
  value,
  onClick,
  children
}) => (
  <div
    className={classnames('vd-tab', classes, {
      'vd-tab--active': !!activeValue ? activeValue === value : active
    })}
  >
    {type === 'anchor' ? (
      <NavLink className="vd-tab-button" to={link}>
        {children}
      </NavLink>
    ) : (
      <button
        className="vd-tab-button"
        type="button"
        onClick={e => onClick(e, value)}
      >
        {children}
      </button>
    )}
  </div>
);
RBTab.displayName = 'rb-tab';

export default RBTab;
