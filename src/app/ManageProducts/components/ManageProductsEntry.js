import React from 'react';
import PropTypes from 'prop-types';
import ProductsHome from '../containers/ProductsHomePageContainer';
import CRUDProducts from '../containers/CRUDProductsPageContainer';
import ViewProducts from '../containers/ViewProductsPageContainer';
import ImportProducts from '../containers/ImportProductsPageContainer';
import ProductTypes from '../containers/ProductTypesPageContainer';
import ProductBrands from '../containers/ProductBrandsPageContainer';
import ProductSuppliers from '../containers/ProductSuppliersPageContainer';
import ProductTags from '../containers/ProductTagsPageContainer';
import { MANAGE_PRODUCTS } from '../../../constants/pageTags';
import { logRender } from '../../../utils/debug';

const ManageProductsEntry = ({ page }) => {
  logRender('render Manage Products Entry');
  return page.tag === MANAGE_PRODUCTS.HOME ? (
    <ProductsHome />
  ) : page.tag === MANAGE_PRODUCTS.CRUD ? (
    <CRUDProducts params={page.props} />
  ) : page.tag === MANAGE_PRODUCTS.VIEW ? (
    <ViewProducts params={page.props} />
  ) : page.tag === MANAGE_PRODUCTS.IMPORT ? (
    <ImportProducts />
  ) : page.tag === MANAGE_PRODUCTS.TYPE ? (
    <ProductTypes />
  ) : page.tag === MANAGE_PRODUCTS.BRAND ? (
    <ProductBrands />
  ) : page.tag === MANAGE_PRODUCTS.SUPPLIER ? (
    <ProductSuppliers />
  ) : page.tag === MANAGE_PRODUCTS.TAG ? (
    <ProductTags />
  ) : (
    <div />
  );
};

const { object } = PropTypes;
ManageProductsEntry.propTypes = {
  page: object.isRequired
};

export default ManageProductsEntry;
