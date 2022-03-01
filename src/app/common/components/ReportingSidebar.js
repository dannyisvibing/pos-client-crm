import React from 'react';
import { NavLink } from 'react-router-dom';
import { logRender } from '../../../utils/debug';

const pathnames = [
  '/reporting/inventory_on_hand',
  '/reporting/inventory_low',
  '/reporting/inventory',
  '/reporting/ppr'
];

const NavItem = ({ title, to, disabled }) =>
  !disabled ? (
    <NavLink
      to={to}
      className="navitem"
      isActive={(match, location) => {
        if (to === '/reporting') return location.pathname === '/reporting';
        if (
          to === '/reporting/inventory_on_hand' &&
          pathnames.indexOf(location.pathname) > -1
        )
          return true;
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

const ReportingSidebar = props => {
  logRender('render ReportingSidebar');
  const { isOnline } = props;
  return (
    <div className="vd-secondary-sidebar vd-secondary-sidebar-content">
      <NavItem title="Retail Dashboard" to="/reporting" disabled={!isOnline} />
      <NavItem
        title="Sales Reports"
        to="/reporting/summary"
        disabled={!isOnline}
      />
      <NavItem
        title="Inventory Reports"
        to="/reporting/inventory_on_hand"
        disabled={!isOnline}
      />
      <NavItem
        title="Payment Reports"
        to="/reporting/payment_type"
        disabled={!isOnline}
      />
      <NavItem
        title="Register Closures"
        to="/reporting/closures"
        disabled={!isOnline}
      />
      <NavItem
        title="Gift Card Reports"
        to="/reporting/gift_cards"
        disabled={!isOnline}
      />
      <NavItem
        title="Store Credit Reports"
        to="/reporting/store_credit"
        disabled={!isOnline}
      />
      <NavItem
        title="Tax Reports"
        to="/reporting/tax_rate"
        disabled={!isOnline}
      />
    </div>
  );
};

export default ReportingSidebar;
