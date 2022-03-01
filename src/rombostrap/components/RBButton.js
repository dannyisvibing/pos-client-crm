import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const RBButtonGroup = ({ classes, children }) => (
  <div className={classnames('vd-button-group', classes)}>{children}</div>
);

const RBButton = ({
  href,
  isNavLink = true,
  modifiers,
  category,
  classes,
  children,
  ...props
}) => {
  let rbCategory,
    rbModifiers = [];

  // The panel button can have no category.
  if (modifiers.indexOf('panel') > -1) {
    rbCategory = category || 'primary';
  } else {
    rbCategory = category;
  }

  if (modifiers) {
    rbModifiers = modifiers.map(modifier => `vd-button--${modifier}`);
  }

  if (!rbCategory || modifiers.indexOf('inline') > -1) {
    rbCategory = '';
  } else {
    rbCategory = `vd-button--${rbCategory}`;
  }

  if (modifiers.indexOf('icon') > -1 || modifiers.indexOf('text') > -1) {
    const BORDERLESS_MODIFIERS = ['strong', 'subtle', 'table'];
    const borderlessModifier = modifiers.find(modifier =>
      BORDERLESS_MODIFIERS.indexOf(modifier)
    );

    if (borderlessModifier) {
      rbModifiers.push(`vd-button--${borderlessModifier}`);
    }
  }

  return !href ? (
    <button
      className={classnames(
        'vd-button',
        classes,
        rbModifiers.join(' '),
        rbCategory
      )}
      {...props}
    >
      {children}
    </button>
  ) : isNavLink ? (
    <NavLink
      to={href}
      className={classnames(
        'vd-button',
        classes,
        rbModifiers.join(' '),
        rbCategory
      )}
      {...props}
    >
      {children}
    </NavLink>
  ) : (
    <a
      href={href}
      className={classnames(
        'vd-button',
        classes,
        rbModifiers.join(' '),
        rbCategory
      )}
      {...props}
    >
      {children}
    </a>
  );
};

RBButton.propTypes = {
  modifiers: PropTypes.arrayOf(
    PropTypes.oneOf([
      'big',
      'inline',
      'panel',
      'ghost',
      'text',
      'icon',
      'strong',
      'subtle',
      'table'
    ])
  ),
  category: PropTypes.oneOf(['primary', 'secondary', 'negative'])
};

RBButton.defaultProps = {
  modifiers: []
};

export default RBButton;
