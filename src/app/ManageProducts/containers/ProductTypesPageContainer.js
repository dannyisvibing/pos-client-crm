import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ProductTypes from '../components/ProductTypesPage';
import { openModal } from '../../../modules/modal';
import { fetchProducts } from '../../../modules/product';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ProductTypesPage';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal
    },
    dispatch
  );

const enhance = compose(connect(null, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchProducts
  },
  resolve: async props => {
    await props.fetchProducts();
  }
})(enhance(ProductTypes));
