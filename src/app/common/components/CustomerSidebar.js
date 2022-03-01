import React from 'react';
import { NavLink } from 'react-router-dom';
import { logRender } from '../../../utils/debug';

const pathnames = [
  '/customer',
  '/customer/import',
  '/customer/add',
  '/customer/edit'
];

const NavItem = ({ title, to, disabled }) =>
  !disabled ? (
    <NavLink
      to={to}
      className="navitem"
      isActive={(match, location) => {
        if (to === '/customer')
          return pathnames.indexOf(location.pathname) >= 0;
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

const CustomerSidebar = props => {
  logRender('render CustomerSidebar');
  const { isOnline } = props;
  return (
    <div className="vd-secondary-sidebar vd-secondary-sidebar-content">
      <NavItem title="Customers" to="/customer" disabled={!isOnline} />
      <NavItem title="Groups" to="/customer/group" disabled={!isOnline} />
    </div>
  );
};

export default CustomerSidebar;
