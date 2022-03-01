import React from 'react';
import PropTypes from 'prop-types';
import MainContentLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { RBButton, RBLink } from '../../../rombostrap';
import ProductSuppliersTable from '../containers/ProductSuppliersTableContainer';
import ModalTypes from '../../../constants/modalTypes';
import { logRender } from '../../../utils/debug';

const ProductSupplierPage = props => {
  logRender('render ProductSupplierPage');
  const { openModal } = props;
  return (
    <MainContentLayout title="Suppliers">
      <TipComponent>
        <div className="vd-flex vd-flex--forced-row vd-flex--row vd-flex--justify-between vd-flex--align-center">
          <span>
            View and manage your suppliers.{' '}
            <RBLink isNavLink={false} secondary />Need help?
          </span>
          <RBButton
            category="primary"
            onClick={e => {
              e.preventDefault();
              openModal({ type: ModalTypes.PRODUCT_SUPPLIERS });
            }}
          >
            Add Supplier
          </RBButton>
        </div>
      </TipComponent>
      <BodyComponent>
        <ProductSuppliersTable />
      </BodyComponent>
    </MainContentLayout>
  );
};

const { func } = PropTypes;
ProductSupplierPage.propTypes = {
  openModal: func.isRequired
};

export default ProductSupplierPage;
