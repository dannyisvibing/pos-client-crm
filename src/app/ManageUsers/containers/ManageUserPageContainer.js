import { compose } from 'redux';
import { connect } from 'react-redux';
import ManageUser from '../legacy/Users/ManageUser';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import {
  fetchRoles,
  usersSelector,
  rolesSelector,
  canView,
  getUserById,
  activeUserSelector
} from '../../../modules/user';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ManageUserPage';

const mapStateToProps = state => ({
  outlets: outletsSelector(state),
  users: usersSelector(state),
  roles: rolesSelector(state),
  activeUser: activeUserSelector(state),
  canView(user) {
    return canView(state, user);
  },
  getUserById(id) {
    return getUserById(state, id);
  }
});

const enhance = compose(connect(mapStateToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchOutlets,
    fetchRoles
  },
  resolve: async props => {
    await props.fetchOutlets();
    await props.fetchRoles();
  }
})(enhance(ManageUser));
