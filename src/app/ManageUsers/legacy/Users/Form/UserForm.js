import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import find from 'lodash/find';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import forEach from 'lodash/forEach';
import Profile from './Profile';
import Outlets from './Outlets';
import Role from './Role';
import Security from './Security';
import SaveModal from '../SaveModal';
import {
  RBSection,
  RBSectionBack,
  RBHeader,
  RBSave
} from '../../../../../rombostrap';
import { RBSectionActionBar } from '../../../../../rombostrap/components/RBSection';
import {
  isActiveUser,
  canManageUsers,
  canManageRoles,
  canManageUserOutlets,
  canDeleteUser,
  getUserDisplayName,
  createUser,
  updateUser
} from '../../../../../modules/user';

class UserForm extends Component {
  state = {};

  componentWillMount() {
    var user = Object.assign({}, this.props.user);
    var originalUser = Object.assign({}, this.props.user);
    var isCreate = !this.props.user;
    var canDelete = isCreate ? false : this.props.canDeleteUser(user);
    var canManageOutlets = isCreate
      ? true
      : this.props.canManageUserOutlets(user);
    var canManageRoles = this.props.canManageRoles();
    var canManageUsers = this.props.canManageUsers();
    var roleOptions = map(
      orderBy(this.props.roles, 'position', 'desc'),
      role => {
        return {
          name: role.name,
          value: role.roleId
        };
      }
    );
    user.accountType =
      find(
        roleOptions,
        role =>
          role.name.toUpperCase() === String(user.accountType).toUpperCase()
      ) || roleOptions[0];

    this.setState({
      user,
      originalUser,
      isCreate,
      canDelete,
      canManageOutlets,
      canManageRoles,
      canManageUsers,
      passwordScore: {},
      roleOptions,
      apiErrorMessages: {}
    });
  }

  handleProfileChange = (key, value) => {
    var user = this.state.user;
    user[key] = value;
    this.setState({ user, dirty: true });
  };

  handleOutletIdsSelected = restrictedOutletIds => {
    var user = this.state.user;
    user.restrictedOutletIds = restrictedOutletIds;
    this.setState({ user, dirty: true });
  };

  handleRoleChange = role => {
    var user = this.state.user;
    user.accountType = role;
    this.setState({ user, dirty: true });
  };

  handlePasswordChange = (key, value) => {
    var user = this.state.user;
    user[key] = value;
    this.setState({ user, dirty: true });
  };

  handlePasswordScoreChange = score => {
    this.setState({ passwordScore: score });
  };

  confirmSave = e => {
    if (e) e.preventDefault();
    const { isCreate, user } = this.state;
    const { isActiveUser } = this.props;
    if (isCreate || (isActiveUser(user) && !user.password)) {
      return this.performSave();
    }

    this.saveModalRef.open().then(password => this.performSave(password));
  };

  async performSave(password) {
    const { canManageRoles, canManageUserOutlets } = this.props;
    const { user } = this.state;
    let userFormData = {};
    if (canManageRoles() && !user.isPrimaryUser) {
      userFormData.accountType = user.accountType.value;
    }
    userFormData.userId = user.userId;
    userFormData.username = user.username;
    userFormData.displayName = user.displayName;
    userFormData.userEmail = user.userEmail;
    userFormData.password = user.password;
    userFormData.passwordAgain = user.passwordRepeat;

    if (canManageUserOutlets(user)) {
      forEach(user.restrictedOutletIds, outletId => {
        userFormData.outletIds = userFormData.outletIds || [];
        userFormData.outletIds.push(outletId);
      });
    }

    if (this.state.saving) {
      return;
    }

    this.setState({ saving: true });
    userFormData.currentUserPassword = password;
    if (userFormData.userId) {
      await this.props.updateUser(userFormData);
    } else {
      await this.props.createUser(userFormData);
    }
    this.setState({
      user: {
        ...this.state.user,
        updatedAt: new Date()
      },
      saving: false,
      dirty: false
    });
  }

  confirmDelete() {}

  render() {
    const { backButton, outlets } = this.props;
    const {
      isCreate,
      user,
      originalUser,
      canManageOutlets,
      canManageRoles,
      canDelete,
      roleOptions,
      apiErrorMessages
    } = this.state;
    return (
      <div>
        {/* To Do - Banner for email verification */}
        <form>
          <RBSection>
            <RBHeader category="page">
              {!!backButton && <RBSectionBack href="/setup/users" />}
              {isCreate ? 'Create a user' : originalUser.username}
            </RBHeader>
          </RBSection>
          <RBSection type="action-bar">
            <RBSectionActionBar type="about">
              {isCreate && (
                <div>
                  Create a new user and select what the user has access to.
                </div>
              )}
              {!isCreate && (
                <div>
                  Change {getUserDisplayName(originalUser)}'s personal
                  information including their role.
                </div>
              )}
            </RBSectionActionBar>
            <RBSectionActionBar type="actions">
              <RBSave
                lastUpdated={user.updatedAt}
                form={{ dirty: this.state.dirty }}
                saving={this.state.saving}
                onSave={this.confirmSave}
              />
            </RBSectionActionBar>
          </RBSection>
          <RBSection>
            <Profile
              userForm={{ name: {}, email: {} }}
              user={user}
              apiErrorMessages={apiErrorMessages}
              onProfileChange={this.handleProfileChange}
            />
          </RBSection>
          <RBSection>
            <hr className="vd-hr" />
            <Outlets
              user={user}
              outlets={outlets}
              canManageOutlets={canManageOutlets}
              onOutletIdsSelected={this.handleOutletIdsSelected}
            />
          </RBSection>
          <RBSection>
            <hr className="vd-hr" />
            <Role
              canManageRoles={canManageRoles}
              user={user}
              roleOptions={roleOptions}
              onRoleChange={this.handleRoleChange}
            />
          </RBSection>
          <RBSection>
            <hr className="vd-hr" />
            <Security
              isCreate={isCreate}
              user={user}
              passwordScore={this.state.passwordScore}
              onPasswordScoreChange={this.handlePasswordScoreChange}
              onPasswordChange={this.handlePasswordChange}
            />
          </RBSection>
          <RBSection>
            <hr className="vd-hr" />
            {canDelete && (
              <a
                className="vd-text--negative pro-delete-user-link"
                href=""
                onClick={this.confirmDelete}
              >
                Delete User
              </a>
            )}
          </RBSection>
        </form>
        <SaveModal ref={c => (this.saveModalRef = c)} user={user} />
      </div>
    );
  }
}

export default connect(
  state => ({
    isActiveUser(user) {
      return isActiveUser(state, user);
    },
    canManageUsers() {
      return canManageUsers(state);
    },
    canManageRoles() {
      return canManageRoles(state);
    },
    canDeleteUser(user) {
      return canDeleteUser(state, user);
    },
    canManageUserOutlets(user) {
      return canManageUserOutlets(state, user);
    }
  }),
  dispatch =>
    bindActionCreators(
      {
        createUser,
        updateUser
      },
      dispatch
    )
)(UserForm);
