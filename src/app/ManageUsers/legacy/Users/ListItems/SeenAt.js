import React from 'react';
import { RBTD } from '../../../../../rombostrap/components/RBTable/RBTable';
import timeAgo from '../../../../../utils/timeAgo';

const SeenAt = ({ user }) => (
  <RBTD classes="vd-sml-pad-h vd-text--sub up-sentence-case">
    {timeAgo(user.seenAt) || 'Never'}
  </RBTD>
);

export default SeenAt;
