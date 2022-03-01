import React from 'react';
import TargetInput from '../../Layout/TargetInput';
import { RBTD } from '../../../../../rombostrap/components/RBTable/RBTable';
import { RBField } from '../../../../../rombostrap';

const TargetInputWrapper = ({ user, period, value }) => (
  <RBTD classes="vd-sml-pad-h up-user-input-cell pro-daily-target-case">
    <RBField classes="vd-mbn">
      <TargetInput userId={user.userId} period={period} value={value} />
    </RBField>
  </RBTD>
);

export default TargetInputWrapper;
