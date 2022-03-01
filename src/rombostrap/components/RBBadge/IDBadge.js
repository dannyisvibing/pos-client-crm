import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export const Avatar = ({ children }) => <div>{children}</div>;
Avatar.displayName = 'avatar';

export const Header = ({ children }) => <div>{children}</div>;
Header.displayName = 'header';

export const Description = ({ children }) => <div>{children}</div>;
Description.displayName = 'description';

const IDBadge = ({ modifiers = [], inlineImage, children, ...props }) => {
  if (props.onClick) {
    if (modifiers.indexOf('interactive') === -1) modifiers.push('interactive');
  }

  return (
    <div
      className={classnames(
        'vd-id-badge',
        modifiers.map(modifier => `vd-id-badge--${modifier}`).join(' ')
      )}
      onClick={props.onClick ? props.onClick : e => {}}
    >
      {React.Children.map(
        children,
        child =>
          child.type.displayName === 'avatar' && (
            <div
              className="vd-id-badge__image"
              style={{ backgroundImage: `url(${inlineImage})` }}
            >
              {child}
            </div>
          )
      )}
      <div className="vd-id-badge__content">
        {React.Children.map(
          children,
          child =>
            child.type.displayName === 'header' && (
              <div className="vd-id-badge__header">{child}</div>
            )
        )}
        {React.Children.map(
          children,
          child =>
            child.type.displayName === 'description' && (
              <div className="vd-id-badge__description">{child}</div>
            )
        )}
      </div>
    </div>
  );
};

IDBadge.propTypes = {
  modifiers: PropTypes.arrayOf(
    PropTypes.oneOf(['current', 'interactive', 'small'])
  )
};

export default IDBadge;
