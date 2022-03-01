import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchOutlets, myOutletsSelector } from '../../../modules/outlet';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import ManageInventoryCountPage from '../legacy/Manage';

const PAGE_TAG = 'ManageInventoryCount';

const mapStateToProps = state => ({
  myOutlets: myOutletsSelector(state)
});

const mapDispatchToProps = {};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchOutlets
  },
  resolve: async props => {
    await props.fetchOutlets();
  }
})(enhance(ManageInventoryCountPage));
