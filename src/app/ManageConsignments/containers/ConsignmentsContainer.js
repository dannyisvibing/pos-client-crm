import { compose } from 'redux';
import { connect } from 'react-redux';
import Consignments from '../legacy/Consignments';
import { suppliersSelector, fetchSuppliers } from '../../../modules/product';
import { fetchOutlets, myOutletsSelector } from '../../../modules/outlet';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'Consignments';

const mapStateToProps = state => ({
  suppliers: suppliersSelector(state),
  myOutlets: myOutletsSelector(state)
});

const enhance = compose(connect(mapStateToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchSuppliers,
    fetchOutlets
  },
  resolve: async props => {
    await props.fetchSuppliers();
    await props.fetchOutlets();
  }
})(enhance(Consignments));
