import { compose } from 'redux';
import { connect } from 'react-redux';
import UsersHome from '../legacy/Users';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import {
  fetchRoles,
  usersSelector,
  rolesSelector,
  canManageRoles
} from '../../../modules/user';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'UsersHomePage';

const mapStateToProps = state => ({
  outlets: outletsSelector(state),
  users: usersSelector(state),
  roles: rolesSelector(state),
  canManageRoles() {
    return canManageRoles(state);
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
})(enhance(UsersHome));
