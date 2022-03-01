import React from 'react';
import { RBSection, RBHeader, RBSectionBack } from '../../../../rombostrap';

const Header = ({ name, status }) => (
  <RBSection>
    <RBHeader category="page">
      <RBSectionBack href="/product/consignment" />
      {name} (<span className="consignment-status">{status}</span>)
    </RBHeader>
  </RBSection>
);

export default Header;
