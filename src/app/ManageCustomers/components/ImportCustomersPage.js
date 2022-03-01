import React from 'react';
import {
  RBSection,
  RBSectionBack,
  RBHeader,
  RBFlex,
  RBLink,
  RBButton
} from '../../../rombostrap';
import CSVImport from '../../CSVImport';

const ImportCustomersPage = () => {
  return (
    <div>
      <RBSection>
        <RBHeader category="page">
          <RBSectionBack href="/customer" />
          Import Customers
        </RBHeader>
      </RBSection>
      <RBSection type="action-bar">
        <RBFlex flex flexJustify="between" flexAlign="center">
          <span className="vd-mrl">
            Create a CSV. We'll check your CSV for common errors before
            uploading it.&nbsp;&nbsp;
            <RBLink secondary onClick={() => {}}>
              Download Template
            </RBLink>
          </span>
          <RBButton category="secondary" href="/product">
            Back to Customers
          </RBButton>
        </RBFlex>
      </RBSection>
      <CSVImport entity="customer" />
    </div>
  );
};

export default ImportCustomersPage;
