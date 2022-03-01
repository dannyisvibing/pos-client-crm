import React from 'react';
import PropTypes from 'prop-types';
import MainContentLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { RBButton, RBLink } from '../../../rombostrap';
import ProductTypeTable from '../containers/ProductTypeTableContainer';
import ModalTypes from '../../../constants/modalTypes';
import { logRender } from '../../../utils/debug';

const ProductTypesPage = props => {
  logRender('render ProductTypesPage');
  const { openModal } = props;
  return (
    <MainContentLayout title="Product Types">
      <TipComponent>
        <div className="vd-flex vd-flex--forced-row vd-flex--row vd-flex--justify-between vd-flex--align-center">
          <span>
            A list of all of your price types.{' '}
            <RBLink isNavLink={false} secondary />Need help?
          </span>
          <RBButton
            category="primary"
            onClick={e => {
              e.preventDefault();
              openModal({ type: ModalTypes.PRODUCT_TYPES });
            }}
          >
            Add Type
          </RBButton>
        </div>
      </TipComponent>
      <BodyComponent>
        <ProductTypeTable />
      </BodyComponent>
    </MainContentLayout>
  );
};

const { func } = PropTypes;
ProductTypesPage.propTypes = {
  openModal: func.isRequired
};

export default ProductTypesPage;
