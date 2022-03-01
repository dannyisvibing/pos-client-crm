import React from 'react';
import { RBSection, RBHeader, RBFlex, RBButton } from '../../../rombostrap';
import PricebooksTable from '../containers/PricebooksTableContainer';
import { logRender } from '../../../utils/debug';

const PricebooksHomePage = props => {
  logRender('render PricebooksHomePage');
  return (
    <div className="vd-primary-layout">
      <RBSection>
        <RBHeader category="page">Price Books</RBHeader>
      </RBSection>
      <RBSection type="secondary">
        <RBFlex
          flex
          flexDirection="row"
          flexJustify="between"
          flexAlign="center"
        >
          <span className="vd-mrl">A list of all of your price books.</span>
          <RBButton category="primary" href="/product/price_book/new">
            Add Price Book
          </RBButton>
        </RBFlex>
      </RBSection>
      <RBSection>
        <PricebooksTable />
      </RBSection>
    </div>
  );
};

export default PricebooksHomePage;
