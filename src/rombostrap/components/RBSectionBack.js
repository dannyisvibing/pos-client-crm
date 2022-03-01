import React from 'react';
import { NavLink } from 'react-router-dom';

const RBSectionBack = ({ href }) => (
  <NavLink className="vd-section-back" role="button" to={href}>
    <i className="vd-section-back-icon fa fa-arrow-left" />
  </NavLink>
);

export default RBSectionBack;
