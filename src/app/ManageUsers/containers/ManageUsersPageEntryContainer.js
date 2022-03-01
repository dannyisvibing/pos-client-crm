import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ManageUsersPageEntry from '../components/ManageUsersPageEntry';
import { canManageUsers, canManageRoles } from '../../../modules/user';
import { routerReplace } from '../../../modules/app';

const mapStateToProps = state => ({
  canManageUsers() {
    return canManageUsers(state);
  },
  canManageRoles() {
    return canManageRoles(state);
  }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      routerReplace
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(ManageUsersPageEntry);
