import React from 'react';
import PropTypes from 'prop-types';
import ProductsSidebar from '../containers/ProductsSidebarContainer';
import { logRender } from '../../../utils/debug';

const ProductsLayout = ({ children }) => {
  logRender('render ProductsLayout');
  return (
    <div className="vd-content-container">
      <ProductsSidebar />
      <div className="vd-content-main-container">{children}</div>
    </div>
  );
};

const { any } = PropTypes;
ProductsLayout.propTypes = {
  children: any.isRequired
};

export default ProductsLayout;
