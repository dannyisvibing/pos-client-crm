import React from 'react';
import { NavLink } from 'react-router-dom';
import { logRender } from '../../../utils/debug';

const NavItemContent = ({ faIcon, title }) => (
  <div className="baritem">
    <i className={`fa fa-${faIcon}`} style={{ fontSize: '20px' }} />
    <div>{title}</div>
  </div>
);

const NavItem = ({ disabled, to, color, ...rest }) =>
  !disabled ? (
    <NavLink to={to} style={{ color }} className="navitem">
      <NavItemContent {...rest} />
    </NavLink>
  ) : (
    <div className="navitem --offline">
      <NavItemContent {...rest} />
    </div>
  );

const AppSidebar = props => {
  logRender('render AppSidebar');
  const { isOnline } = props;
  return (
    <div className="vd-primary-sidebar vd-primary-sidebar-content">
      <NavItem
        disabled={!isOnline}
        faIcon="home"
        color="#a059b5"
        title="Home"
        to="/dashboard"
      />
      <NavItem
        disabled={false}
        faIcon="fax"
        color="#4ab773"
        title="Sell"
        to="/webregister"
      />
      {/* <NavItem
        faIcon="book"
        color="#56bad6"
        title="Sales Ledger"
        to="/history"
      /> */}
      <NavItem
        disabled={!isOnline}
        faIcon="laptop"
        color="#f3c276"
        title="Reporting"
        to="/reporting"
      />
      <NavItem
        disabled={!isOnline}
        faIcon="tags"
        color="#f5765f"
        title="Products"
        to="/product"
      />
      <NavItem
        disabled={!isOnline}
        faIcon="users"
        color="#a059b5"
        title="Customers"
        to="/customer"
      />
      {/* <NavItem
        faIcon="shopping-cart"
        color="#44b773"
        title="Ecommerce"
        to="/admin"
      /> */}
      <NavItem
        disabled={!isOnline}
        faIcon="cog"
        color="#485770"
        title="Setup"
        to="/setup"
      />
    </div>
  );
};

export default AppSidebar;
