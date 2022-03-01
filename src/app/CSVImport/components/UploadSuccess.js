import React from 'react';
import { RBSection, RBHeader, RBP, RBButton } from '../../../rombostrap';

const UploadSuccess = ({
  subject,
  fileName,
  importedCount,
  onCancel,
  onSend
}) => (
  <RBSection classes="vd-align-center">
    <RBHeader category="subpage">"{fileName}" is ready to upload.</RBHeader>
    <RBP classes="vd-mtl">
      You will import {importedCount} {subject} if you continue.
    </RBP>
    <div>
      <RBButton category="secondary" onClick={onCancel}>
        Cancel import
      </RBButton>
      <RBButton category="primary" onClick={onSend}>
        Continue with import
      </RBButton>
    </div>
  </RBSection>
);

export default UploadSuccess;
