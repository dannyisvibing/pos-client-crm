import React from 'react';
import PropTypes from 'prop-types';
import MainContentLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { RBButton, RBLink } from '../../../rombostrap';
import ProductBrandsTable from '../containers/ProductBrandsTableContainer';
import ModalTypes from '../../../constants/modalTypes';
import { logRender } from '../../../utils/debug';

const ProductBrandsPage = props => {
  logRender('render ProductBrandsPage');
  const { openModal } = props;
  return (
    <MainContentLayout title="Brands">
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
              openModal({ type: ModalTypes.PRODUCT_BRANDS });
            }}
          >
            Add Brand
          </RBButton>
        </div>
      </TipComponent>
      <BodyComponent>
        <ProductBrandsTable />
      </BodyComponent>
    </MainContentLayout>
  );
};

const { func } = PropTypes;
ProductBrandsPage.propTypes = {
  openModal: func.isRequired
};

export default ProductBrandsPage;
