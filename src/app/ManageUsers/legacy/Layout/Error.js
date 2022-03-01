import React from 'react';
import { RBSection, RBHeader } from '../../../../rombostrap';

const Error = ({ message }) => (
  <RBSection>
    <RBHeader category="subpage" classes="vd-mtxl">
      {message || 'Something went wrong'}
    </RBHeader>
  </RBSection>
);

export default Error;
