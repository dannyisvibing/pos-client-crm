import React from 'react';
import { RBSection, RBHeader, RBLoader } from '../../../rombostrap';

const UploadSending = () => (
  <RBSection classes="vd-align-center">
    <RBHeader category="subpage">
      <RBLoader classes="vd-mbm" />
      <div>Importing...</div>
    </RBHeader>
  </RBSection>
);

export default UploadSending;
