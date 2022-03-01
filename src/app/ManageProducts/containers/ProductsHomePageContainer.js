import { compose } from 'redux';
import { pure } from 'recompose';
import ProductsHomePage from '../components/ProductsHomePage';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import {
  fetchBrands,
  fetchSuppliers,
  fetchTags,
  fetchTypes
} from '../../../modules/product';

const PAGE_TAG = 'ProductsHome';

const enhance = compose(
  spinnerWhileLoading(PAGE_TAG, {
    reducers: {
      fetchBrands,
      fetchSuppliers,
      fetchTags,
      fetchTypes
    },
    resolve: async props => {
      await props.fetchBrands();
      await props.fetchSuppliers();
      await props.fetchTags();
      await props.fetchTypes();
    }
  }),
  pure
);

export default enhance(ProductsHomePage);
