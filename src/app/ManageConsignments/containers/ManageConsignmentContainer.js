import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchOutlets, myOutletsSelector } from '../../../modules/outlet';
import ManageConsignment from '../legacy/ManageConsignment';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import {
  fetchProducts,
  fetchSuppliers,
  suppliersSelector
} from '../../../modules/product';
import { routerReplace } from '../../../modules/app';

const PAGE_TAG = 'ManageConsignment';

const mapStateToProps = state => ({
  myOutlets: myOutletsSelector(state),
  suppliers: suppliersSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      routerReplace
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchOutlets,
    fetchProducts,
    fetchSuppliers
  },
  resolve: async props => {
    await props.fetchOutlets();
    await props.fetchProducts();
    await props.fetchSuppliers();
  }
})(enhance(ManageConsignment));
