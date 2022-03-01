import React from 'react';

import IDBadge, { Avatar, Header, Description } from './IDBadge';

const UserBadge = ({ name, email, modifiers, ...props }) => {
  return (
    <div className="vd-user-badge">
      <IDBadge modifiers={modifiers} {...props}>
        <Avatar />
        <Header>{name}</Header>
        {email && <Description>{email}</Description>}
      </IDBadge>
    </div>
  );
};

export default UserBadge;
