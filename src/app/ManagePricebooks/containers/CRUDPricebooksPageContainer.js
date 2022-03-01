import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import yup from 'yup';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import CRUDPricebooksPage from '../components/CRUDPricebooksPage';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import {
  createPricebook,
  fetchPricebooks,
  updatePricebook,
  deletePricebook,
  pricebooksSelector,
  getPricebookById,
  refinePricebook
} from '../../../modules/pricebook';
import { customerGroupsSelector } from '../../../modules/customer';
import { fetchProducts, productsSelector } from '../../../modules/product';
import { routerReplace } from '../../../modules/app';
import { openModal } from '../../../modules/modal';

const PAGE_TAG = 'CRUDPricebook';

const validationSchema = yup.object().shape({
  name: yup.string().required()
});

const mapStateToProps = state => ({
  products: productsSelector(state),
  pricebooks: pricebooksSelector(state),
  customerGroups: customerGroupsSelector(state),
  outlets: outletsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createPricebook,
      updatePricebook,
      deletePricebook,
      routerReplace,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    mapPropsToValues: ({ pricebooks, params }) =>
      getPricebookById(pricebooks, params.bookId),
    validationSchema,
    handleSubmit: async function(values, { props, setSubmitting }) {
      setSubmitting(true);
      const pricebook = refinePricebook(values);
      if (props.params.create) {
        setSubmitting(false);
        const result = await props.createPricebook(pricebook);
        props.routerReplace(
          `/product/price_book/edit/${result.payload.data.bookId}`
        );
      } else {
        await props.updatePricebook(pricebook);
        props.routerReplace('/product/price_book');
      }
    }
  })
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchProducts,
    fetchOutlets,
    fetchPricebooks,
    routerReplace
  },
  resolve: async props => {
    const { params } = props;
    const result = await props.fetchPricebooks({ ids: [params.bookId] });
    const payload = result.payload.data;
    const pricebooks = payload.data;
    const pricebook = getPricebookById(pricebooks, params.bookId);
    if (!params.create && !pricebook.name) {
      props.routerReplace('/product/price_book');
    } else {
      await props.fetchProducts();
      await props.fetchOutlets();
    }
  }
})(enhance(CRUDPricebooksPage));
