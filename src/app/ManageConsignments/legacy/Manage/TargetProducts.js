import React from 'react';
import { RBSection, RBFlex, RBField } from '../../../../rombostrap';
import DescriptionSection from '../../../common/components/DescriptionSection';
import { RBInputErrorMessageSection } from '../../../../rombostrap/components/RBInput';

import SearchForProducts from '../../../common/containers/SearchForProductsContainer';
import TargetProductsTable from './TargetProductsTable';

function getSectionTitle(type) {
  if (type === 'supplierOrder' || type === 'outletTransfer')
    return 'Order products';
  return 'Return products';
}

function getSectionDescription(type) {
  if (type === 'supplierOrder')
    return 'Here, You can add products to order from the supplier';
  if (type === 'supplierReturn')
    return 'Here, You can add products to return to the supplier';
  if (type === 'outletTransfer')
    return 'Here, You can add products to transfer from the source outlet to the destination outlet';
}

const TargetProducts = ({
  type,
  target,
  items,
  formInvalidCode,
  onProductSelect,
  ...props
}) => (
  <RBSection classes="vd-mtl">
    <DescriptionSection
      title={getSectionTitle(type)}
      description={getSectionDescription(type)}
    >
      <RBFlex flex>
        <div className="vd-col-8">
          <SearchForProducts handler={onProductSelect} />
        </div>
        <div className="vd-col-4" />
      </RBFlex>
    </DescriptionSection>
    <RBField classes="vd-mlxl">
      <TargetProductsTable
        type={type}
        target={target}
        items={items}
        {...props}
      />
      {formInvalidCode === 4 && (
        <RBInputErrorMessageSection>
          There are no products in this consignment order yet.
        </RBInputErrorMessageSection>
      )}
    </RBField>
  </RBSection>
);

export default TargetProducts;
