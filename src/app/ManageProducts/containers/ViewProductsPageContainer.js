import { connect } from 'react-redux';
import { compose } from 'redux';
import ViewProductsPage from '../components/ViewProductsPage';
import {
  fetchVariants,
  fetchHistory,
  fetchVariantAttributes,
  productsSelector,
  historySelector,
  variantAttrsSelector,
  generateInventoryTableDatasource,
  generateGeneralData,
  generateHistoryTableDatasource
} from '../../../modules/product';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import { usersSelector } from '../../../modules/user';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ViewProductsPage';

const mapStateToProps = state => ({
  generalData: generateGeneralData(productsSelector(state)),
  inventoryTableDatasource: generateInventoryTableDatasource(
    productsSelector(state),
    outletsSelector(state),
    variantAttrsSelector(state)
  ),
  historyTableDatasource: generateHistoryTableDatasource(
    historySelector(state),
    usersSelector(state),
    outletsSelector(state)
  )
});

const enhance = compose(connect(mapStateToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchVariants,
    fetchHistory,
    fetchVariantAttributes,
    fetchOutlets
  },
  resolve: async props => {
    console.log(props.params);
    const { productId } = props.params;
    await props.fetchVariants(productId);
    await props.fetchHistory(productId);
    await props.fetchVariantAttributes();
    await props.fetchOutlets();
  }
})(enhance(ViewProductsPage));
