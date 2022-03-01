import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import WebRegisterRoute from '../components/WebRegisterRoute';
import { fetchUsers } from '../../../modules/user';
import { fetchRetailer } from '../../../modules/retailer';
import spinnerWhileLoadingModule from '../../common/containers/SpinnerWhileLoadingModuleContainer';
import withRouteOfflineHandler from '../../common/containers/WithRouteOfflineHandler';

const MODULE_TAG = 'WebRegisterRoute';

const enhance = compose(withRouteOfflineHandler);

export default compose(
  withRouter,
  spinnerWhileLoadingModule(MODULE_TAG, {
    reducers: {
      fetchUsers,
      fetchRetailer
    },
    resolve: async props => {
      await props.fetchUsers();
      await props.fetchRetailer();
    }
  })
)(enhance(WebRegisterRoute));
