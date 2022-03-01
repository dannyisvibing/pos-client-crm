import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withProps, withHandlers } from 'recompose';
import SalePage from '../components/SalePage';
import {
  fetchRegisters,
  getCurrentRegisterFromApi,
  getCurrentRegisterFromState
} from '../../../modules/register';
import { fetchOutlets } from '../../../modules/outlet';
import {
  fetchProducts,
  productsSelector,
  fetchVariantAttributes
} from '../../../modules/product';
import { fetchPricebooks } from '../../../modules/pricebook';
import { fetchCustomers, fetchCustomerGroups } from '../../../modules/customer';
import {
  fetchQkLayout,
  fetchClosures,
  fetchSalesTax,
  fetchPaymentMethods,
  qkLayoutsSelector,
  closuresSelector,
  addProductToSale,
  initializeSale
} from '../../../modules/sale';
import { openModal } from '../../../modules/modal';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import ModalTypes from '../../../constants/modalTypes';

export const PAGE_TAG = 'SalesPage';

const mapStateToProps = state => ({
  products: productsSelector(state),
  currentRegister: getCurrentRegisterFromState(state),
  qkLayout: qkLayoutsSelector(state)[0],
  closure: closuresSelector(state)[0]
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal,
      addProductToSale
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ products }) => ({
    productsHash: _.keyBy(products, 'id')
  })),
  withHandlers({
    onClickProductSuggestion: props => suggestion => {
      if (suggestion.variantCount > 0) {
        props.openModal({
          type: ModalTypes.SELECT_VARIANT,
          productId: suggestion.productId,
          confirmHandler: selectedProductId => {
            props.addProductToSale(selectedProductId);
          }
        });
      } else {
        props.addProductToSale(suggestion.productId);
      }
    },
    onClickQk: props => qk => {
      if (qk.productId) {
        props.addProductToSale(qk.productId);
      }
    }
  })
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchCustomers,
    fetchCustomerGroups,
    fetchProducts,
    fetchPricebooks,
    fetchVariantAttributes,
    fetchOutlets,
    fetchRegisters,
    fetchQkLayout,
    fetchClosures,
    fetchSalesTax,
    fetchPaymentMethods,
    initializeSale
  },
  resolve: async props => {
    await props.fetchCustomers();
    await props.fetchCustomerGroups();
    await props.fetchProducts();
    await props.fetchVariantAttributes();
    await props.fetchOutlets();
    const result = await props.fetchRegisters();
    const payload = result.payload.data;
    const currentRegister = getCurrentRegisterFromApi(payload.data);
    await props.fetchClosures(currentRegister.registerId, {
      ids: [currentRegister.openingClosureId]
    });
    const qkLayoutId = currentRegister.currentQklayoutId;
    await props.fetchQkLayout({ ids: [qkLayoutId] });
    await props.fetchPricebooks({
      outlet: currentRegister.outletId,
      date: moment().format('YYYY-MM-DD hh:mm:ss')
    });
    await props.fetchSalesTax();
    await props.fetchPaymentMethods();
    await props.initializeSale();
  }
})(enhance(SalePage));
