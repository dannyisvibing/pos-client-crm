import React from 'react';
import { RBSection, RBHeader, RBFlex, RBLoader } from '../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import ProductsFilter from '../containers/ProductsFilterContainer';
import ProductTable from '../containers/ProductTableContainer';
import '../styles/common.css';
import { logRender } from '../../../utils/debug';

const ProductsHomePage = () => {
  logRender('render ProductsHomePage');
  return (
    <div className="products-page-container">
      <RBSection>
        <RBHeader category="page">Products</RBHeader>
      </RBSection>
      <RBSection type="secondary">
        <RBFlex flex flexJustify="between" flexAlign="center">
          <span className="vd-mrl">
            Add, view and edit your products all in one place.
          </span>
          <RBButtonGroup>
            <RBButton href="/product/import" category="secondary">
              Import
            </RBButton>
            <RBButton href="/product/new" category="primary">
              Add Product
            </RBButton>
          </RBButtonGroup>
        </RBFlex>
      </RBSection>
      <ProductsFilter />
      <RBSection>{false ? <RBLoader /> : <ProductTable />}</RBSection>
    </div>
  );
};

export default ProductsHomePage;
