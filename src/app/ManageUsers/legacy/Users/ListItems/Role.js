import React from 'react';
import { RBTD } from '../../../../../rombostrap/components/RBTable/RBTable';

const Role = ({ user }) => (
  <RBTD classes="vd-sml-pad-h pro-user-role up-sentence-case">
    {user.accountType}
  </RBTD>
);

export default Role;
