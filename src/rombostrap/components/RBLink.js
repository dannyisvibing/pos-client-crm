import React from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

const RBLink = ({
  href,
  isNavLink = true,
  classes,
  secondary,
  children,
  ...props
}) =>
  isNavLink && href ? (
    <NavLink
      to={href}
      className={classnames('vd-link', classes, {
        'vd-link--secondary': secondary
      })}
      {...props}
    >
      {children}
    </NavLink>
  ) : (
    <a
      href={href}
      className={classnames('vd-link', classes, {
        'vd-link--secondary': secondary
      })}
      {...props}
    >
      {children}
    </a>
  );

export default RBLink;
