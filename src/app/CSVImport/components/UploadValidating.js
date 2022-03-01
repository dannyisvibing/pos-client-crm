import React from 'react';
import { RBSection, RBHeader, RBLoader } from '../../../rombostrap';

const UploadValidating = () => (
  <RBSection classes="vd-align-center">
    <RBHeader category="subpage">
      <RBLoader classes="vd-mbm" />
      <div>Validating</div>
    </RBHeader>
  </RBSection>
);

export default UploadValidating;
