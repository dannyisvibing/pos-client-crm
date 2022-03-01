import React from 'react';
import PropTypes from 'prop-types';
import MainContentLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { RBButton, RBLink } from '../../../rombostrap';
import ProductTagsTable from '../containers/ProductTagsTableContainer';
import ModalTypes from '../../../constants/modalTypes';
import { logRender } from '../../../utils/debug';

const ProductTagsPage = props => {
  logRender('render ProductTagsPage');
  const { openModal } = props;
  return (
    <MainContentLayout title="Product Tags">
      <TipComponent>
        <div className="vd-flex vd-flex--forced-row vd-flex--row vd-flex--justify-between vd-flex--align-center">
          <span>
            A list of all of your product tags.{' '}
            <RBLink isNavLink={false} secondary />Need help?
          </span>
          <RBButton
            category="primary"
            onClick={e => {
              e.preventDefault();
              openModal({ type: ModalTypes.PRODUCT_TAGS });
            }}
          >
            Add Tag
          </RBButton>
        </div>
      </TipComponent>
      <BodyComponent>
        <ProductTagsTable />
      </BodyComponent>
    </MainContentLayout>
  );
};

const { func } = PropTypes;
ProductTagsPage.propTypes = {
  openModal: func.isRequired
};

export default ProductTagsPage;
