import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mapProps, withHandlers } from 'recompose';
import ViewPricebooksPage from '../components/ViewPricebooksPage';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import {
  fetchPricebooks,
  getPricebookById,
  pricebooksSelector,
  deletePricebook,
  duplicatePricebook
} from '../../../modules/pricebook';
import { fetchProducts } from '../../../modules/product';
import { routerReplace } from '../../../modules/app';
import { openModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const PAGE_TAG = 'ViewPricebooksPage';

const mapStateToProps = state => ({
  pricebooks: pricebooksSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deletePricebook,
      duplicatePricebook,
      routerReplace,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  mapProps(({ pricebooks, params, ...rest }) => ({
    ...rest,
    pricebook: getPricebookById(pricebooks, params.bookId),
    bookId: params.bookId
  })),
  withHandlers({
    onDeletePricebook: props => () => {
      props.openModal({
        type: ModalTypes.WARN_PERMANENT_ACTION,
        confirmHandler: async () => {
          await props.deletePricebook(props.bookId);
          props.routerReplace('/product/price_book');
        }
      });
    },
    onDuplicatePricebook: props => async () => {
      await props.duplicatePricebook(props.bookId);
      props.routerReplace('/product/price_book');
    }
  })
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchPricebooks,
    fetchProducts
  },
  resolve: async props => {
    const { params } = props;
    const result = await props.fetchPricebooks({ ids: [params.bookId] });
    const payload = result.payload.data;
    const pricebooks = payload.data;
    const pricebook = getPricebookById(pricebooks, params.bookId);
    if (!pricebook.name) {
      props.routerReplace('/product/price_book');
    } else {
      await props.fetchProducts();
    }
  }
})(enhance(ViewPricebooksPage));
