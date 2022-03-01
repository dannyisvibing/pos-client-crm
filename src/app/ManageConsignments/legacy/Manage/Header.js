import React from 'react';
import { RBSection, RBHeader, RBSectionBack } from '../../../../rombostrap';

function getOrderTypeString(create, type, target) {
  var title;

  if (create) {
    type === 'supplierOrder' && (title = 'New Purchase Order');
    type === 'supplierReturn' && (title = 'New Stock Return');
    type === 'outletTransfer' && (title = 'New Stock Transfer');
  } else if (type === 'supplierOrder') {
    target === 'entire' && (title = 'Edit Purchase Order');
    target === 'details' && (title = 'Update Order');
    target === 'receive' && (title = 'Receive Purchase Order');
  } else if (type === 'supplierReturn') {
    target === 'entire' && (title = 'Edit Stock Return');
    target === 'details' && (title = 'Update Return');
    target === 'receive' && (title = 'Receive Stock Return');
  } else if (type === 'outletTransfer') {
    target === 'entire' && (title = 'Edit Stock Transfer');
    target === 'details' && (title = 'Update Transfer');
    target === 'receive' && (title = 'Receive Stock Transfer');
  }

  return title;
}

const Header = ({ create, target, type }) => (
  <RBSection>
    <RBHeader category="page">
      <RBSectionBack href="/product/consignment" />
      {getOrderTypeString(create, type, target)}
    </RBHeader>
  </RBSection>
);

export default Header;
