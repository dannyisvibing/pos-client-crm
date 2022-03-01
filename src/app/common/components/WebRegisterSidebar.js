import React from 'react';
import { NavLink } from 'react-router-dom';
import WebRegisterSideTopBar from '../containers/WebRegisterSideTopBarContainer';
import { logRender } from '../../../utils/debug';

const NavItem = ({ title, to, disabled }) =>
  !disabled ? (
    <NavLink
      to={to}
      className="navitem"
      isActive={(match, location) => {
        if (to === '/webregister') return location.pathname === '/webregister';
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
      <WebRegisterSideTopBar isOnline={isOnline} />
      <NavItem title="Sell" to="/webregister" disabled={false} />
      <NavItem
        title="Open/Close"
        to="/webregister/registerclosure"
        disabled={!isOnline}
      />
      <NavItem
        title="Sales History"
        to="/webregister/history"
        disabled={!isOnline}
      />
      <NavItem
        title="Cash Management"
        to="/webregister/cash-management"
        disabled={!isOnline}
      />
      <NavItem title="Status" to="/webregister/status" disabled={false} />
      <NavItem
        title="Settings"
        to="/webregister/settings"
        disabled={!isOnline}
      />
    </div>
  );
};

export default SetupSidebar;
