import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ManageOutlet from '../legacy/Outlet/ManageOutlet';
import { routerReplace } from '../../../modules/app';
import {
  fetchSalesTax,
  taxesSelector,
  createSalesTax
} from '../../../modules/sale';
import {
  fetchOutlets,
  outletsSelector,
  createOutlet,
  updateOutlet
} from '../../../modules/outlet';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ManageOutletsPage';

const mapStateToProps = state => ({
  salesTaxes: taxesSelector(state),
  outlet: outletsSelector(state)[0]
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createOutlet,
      updateOutlet,
      createSalesTax,
      routerReplace
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchSalesTax,
    fetchOutlets
  },
  resolve: async props => {
    const { params } = props;
    if (!params.create) {
      await props.fetchOutlets({ ids: [params.id] });
    }
    await props.fetchSalesTax();
  }
})(enhance(ManageOutlet));
