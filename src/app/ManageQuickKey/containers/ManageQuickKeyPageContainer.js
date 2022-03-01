import _ from 'lodash';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mapProps } from 'recompose';
import ManageQuickKeyPage from '../components/ManageQuickKeyPage';
import { routerReplace } from '../../../modules/app';
import { fetchProducts, productsSelector } from '../../../modules/product';
import {
  fetchQkLayout,
  addQk,
  updateQkLayout,
  qkLayoutsSelector
} from '../../../modules/sale';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ManageQuickKeyPage';

const mapStateToProps = state => ({
  products: productsSelector(state),
  qkLayout: qkLayoutsSelector(state)[0]
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateQkLayout,
      addQk,
      routerReplace
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  mapProps(({ products, ...rest }) => ({
    ...rest,
    productsHash: _.keyBy(products, 'id')
  }))
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchProducts,
    fetchQkLayout
  },
  resolve: async props => {
    await props.fetchProducts();
    const layoutId = props.match.params.layoutId;
    await props.fetchQkLayout({ ids: [layoutId] });
  }
})(enhance(ManageQuickKeyPage));
