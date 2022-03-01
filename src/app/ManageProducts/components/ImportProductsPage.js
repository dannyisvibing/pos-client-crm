import React, { Component } from 'react';
import {
  RBSection,
  RBSectionBack,
  RBHeader,
  RBFlex,
  RBLink,
  RBButton
} from '../../../rombostrap';
import CSVImport from './../../CSVImport';
import { logRender } from '../../../utils/debug';

class ImportProducts extends Component {
  render() {
    logRender('render ImportProducts');
    return (
      <div>
        <RBSection>
          <RBHeader category="page">
            <RBSectionBack href="/product" />
            Import Products
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
              Back to Products
            </RBButton>
          </RBFlex>
        </RBSection>
        <CSVImport entity="product" />
      </div>
    );
  }
}

export default ImportProducts;
