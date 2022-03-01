import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CustomerGroupsPage from '../components/CustomerGroupsPage';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import {
  fetchCustomerGroups,
  customerGroupsSelector
} from '../../../modules/customer';
import { openModal } from '../../../modules/modal';

const PAGE_TAG = 'CustomerGroupsPage';

const mapStateToProps = state => ({
  customerGroups: customerGroupsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchCustomerGroups
  },
  resolve: async props => {
    await props.fetchCustomerGroups();
  }
})(enhance(CustomerGroupsPage));
