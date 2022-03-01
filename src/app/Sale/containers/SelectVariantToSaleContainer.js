import _ from 'lodash';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withProps } from 'recompose';
import SelectVariantToSale from '../components/SelectVariantToSale';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import {
  productsSelector,
  variantAttrsSelector
} from '../../../modules/product';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.SELECT_VARIANT)(state),
  productId: optionsSelector(ModalTypes.SELECT_VARIANT)(state).productId,
  confirmHandler: optionsSelector(ModalTypes.SELECT_VARIANT)(state)
    .confirmHandler,
  products: productsSelector(state),
  variantAttrs: variantAttrsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ products, variantAttrs }) => ({
    productsHash: _.keyBy(products, 'id'),
    variantAttrsHash: _.keyBy(variantAttrs, 'attributeId')
  }))
);

export default enhance(SelectVariantToSale);
