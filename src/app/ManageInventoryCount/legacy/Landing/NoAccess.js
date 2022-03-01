import React from 'react';
import { RBHeader, RBSection } from '../../../../rombostrap';

const NoAccess = () => (
  <div>
    <RBSection>
      <RBHeader category="page">No access</RBHeader>
    </RBSection>
    <RBSection>
      <RBHeader category="subpage" classes="vd-mbl">
        You don't have permission to use this features.
      </RBHeader>
      Contact an admin user if you need access to this feature.
    </RBSection>
  </div>
);

export default NoAccess;
