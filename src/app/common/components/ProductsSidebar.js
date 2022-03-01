import React from 'react';
import { NavLink } from 'react-router-dom';
import { logRender } from '../../../utils/debug';

const pathnames = [
  '/product',
  '/product/import',
  '/product/add_variant',
  '/product/show',
  '/product/edit',
  '/product/new'
];

const NavItem = ({ title, to, disabled }) =>
  !disabled ? (
    <NavLink
      to={to}
      className="navitem"
      isActive={(match, location) => {
        if (
          location.pathname.indexOf('/product/inventory_count') >= 0 &&
          to === '/product/consignment'
        )
          return true;
        if (to === '/product') return pathnames.indexOf(location.pathname) >= 0;
        if (!match) return false;
        return true;
      }}
    >
      <div className="baritem">{title}</div>
    </NavLink>
  ) : (
    <div className="navitem --offline">
      <div className="baritem">{title}</div>
    </div>
  );

const ProductsSidebar = props => {
  logRender('render ProductsSidebar');
  const { isOnline } = props;
  return (
    <div className="vd-secondary-sidebar vd-secondary-sidebar-content">
      <NavItem title="Products" to="/product" disabled={!isOnline} />
      <NavItem
        title="Stock Control"
        to="/product/consignment"
        disabled={!isOnline}
      />
      <NavItem
        title="Price Books"
        to="/product/price_book"
        disabled={!isOnline}
      />
      <NavItem title="Product Types" to="/product/type" disabled={!isOnline} />
      <NavItem title="Suppliers" to="/product/supplier" disabled={!isOnline} />
      <NavItem title="Brand" to="/product/brand" disabled={!isOnline} />
      <NavItem title="Product Tags" to="/product/tag" disabled={!isOnline} />
    </div>
  );
};

export default ProductsSidebar;
