import React from 'react';
import classnames from 'classnames';

export const RBIdBadgeImage = ({ image }) => (
  <div className="vd-id-badge__image" style={{ backgroundImage: image }} />
);

export const RBIdBadgeHeader = ({ children }) => (
  <div className="vd-id-badge__header">{children}</div>
);

export const RBIdBadgeContent = ({ children }) => (
  <div className="vd-id-badge__content">{children}</div>
);

export const RBIdBadgeDescription = ({ children }) => (
  <div className="vd-id-badge__description">{children}</div>
);

const RBIdBadge = ({ current, small, children }) => (
  <div
    className={classnames('vd-id-badge', {
      'vd-id-badge--small': small,
      'vd-id-badge--current': current
    })}
  >
    {children}
  </div>
);

export default RBIdBadge;
