import { connect } from 'react-redux';
import { compose } from 'redux';
import Dashboard from '../components/Dashboard';
import { fetchUsers, activeUserSelector } from '../../../modules/user';
import { fetchRetailer } from '../../../modules/retailer';
import { fetchOutlets, myOutletsSelector } from '../../../modules/outlet';
import spinnerWhileLoadingModule from '../../common/containers/SpinnerWhileLoadingModuleContainer';

const MODULE_TAG = 'Dashboard';

const enhance = compose(
  connect(state => ({
    activeUser: activeUserSelector(state),
    myOutlets: myOutletsSelector(state)
  }))
);

export default spinnerWhileLoadingModule(MODULE_TAG, {
  reducers: {
    fetchUsers,
    fetchRetailer,
    fetchOutlets
  },
  resolve: async props => {
    await props.fetchUsers();
    await props.fetchRetailer();
    await props.fetchOutlets();
  }
})(enhance(Dashboard));
