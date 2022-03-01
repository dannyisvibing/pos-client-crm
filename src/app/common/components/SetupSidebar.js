import React from 'react';
import { NavLink } from 'react-router-dom';
import { logRender } from '../../../utils/debug';

const NavItem = ({ title, to, disabled }) =>
  !disabled ? (
    <NavLink
      to={to}
      className="navitem"
      isActive={(match, location) => {
        if (to === '/setup') return location.pathname === '/setup';
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

const SetupSidebar = props => {
  logRender('render SetupSidebar');
  const { isOnline } = props;
  return (
    <div className="vd-secondary-sidebar vd-secondary-sidebar-content">
      <NavItem title="General" to="/setup" disabled={!isOnline} />
      <NavItem
        title="Outlets and Registers"
        to="/setup/outlets_and_registers"
        disabled={!isOnline}
      />
      <NavItem title="Sales Taxes" to="/setup/taxes" disabled={!isOnline} />
      <NavItem title="Loyalty" to="/setup/loyalty" disabled={!isOnline} />
      <NavItem title="Users" to="/setup/users" disabled={!isOnline} />
      <NavItem
        title="Store Credit"
        to="/setup/store_credit"
        disabled={!isOnline}
      />
    </div>
  );
};

export default SetupSidebar;
