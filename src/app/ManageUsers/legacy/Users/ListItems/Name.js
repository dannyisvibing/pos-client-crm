import React from 'react';
import { RBTD } from '../../../../../rombostrap/components/RBTable/RBTable';
import { RBIDBadge, RBLink } from '../../../../../rombostrap';
import {
  RBIdBadgeImage,
  RBIdBadgeContent,
  RBIdBadgeHeader,
  RBIdBadgeDescription
} from '../../../../../rombostrap/components/RBBadges/RBIDBadge';

const userImagePath = (user, size = 'sm') => {
  return 'url(/img/avatar-100x100.svg)';
};

const userName = user => {
  if (!user) {
    return;
  }

  const displayName = user.displayName ? ` (${user.displayName})` : '';

  return `${user.username}${displayName}`;
};

const Name = ({ user }) => (
  <RBTD classes="vd-no-pad-l vd-sml-pad-r">
    <RBIDBadge small>
      <RBIdBadgeImage image={userImagePath(user)} />
      <RBIdBadgeContent>
        <RBIdBadgeHeader>
          <RBLink
            classes="pro-user-name"
            secondary
            href={`/setup/users/view/${user.userId}`}
          >
            {userName(user)}
          </RBLink>
        </RBIdBadgeHeader>
        {user.userEmail && (
          <RBIdBadgeDescription>{user.userEmail}</RBIdBadgeDescription>
        )}
      </RBIdBadgeContent>
    </RBIDBadge>
  </RBTD>
);

export default Name;
