import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import STATE from '../../../../constants/states';
import MESSAGES from '../../constants/messages';
import Error from '../Layout/Error';
import PermissionGroup from './PermissionsGroup';
import {
  RBLoader,
  RBSection,
  RBSectionBack,
  RBHeader,
  RBFlex,
  RBButton
} from '../../../../rombostrap';
import rbRolePermissionsResolver from '../../utils/rolePermissions.resolver';
import {
  fetchRoles,
  saveRole,
  isAdminRole,
  isCashierRole
} from '../../../../modules/user';

const MODES = {
  edit: 'edit',
  view: 'view'
};

class ManageRole extends Component {
  state = {
    state: STATE.inProgress,
    role: {},
    mode: MODES.view,
    resolvedPermissions: [],
    initialPermissions: []
  };

  async componentWillMount() {
    const { params } = this.props;
    if (!params.roleId) {
      this.props.history.replace('/setup/users/roles');
      return;
    }
    this.permissionGroupRef = {};

    const result = await this.props.fetchRoles(params.roleId);
    const role = result.payload.data[0];
    role.permissions = role.permissions.map(permission => ({
      name: permission,
      value: true
    }));
    var mode;
    if (isAdminRole(role)) {
      mode = MODES.view;
    } else {
      mode = MODES.edit;
    }

    var permissions = rbRolePermissionsResolver.resolvePermissions(role);
    this.setState({
      state: STATE.ready,
      role,
      mode,
      resolvedPermissions: permissions,
      initialPermissions: cloneDeep(permissions)
    });
  }

  canSave(resolvedPermissions) {
    const modifiedPermissions = rbRolePermissionsResolver.getModifiedPermissions(
      this.state.initialPermissions,
      resolvedPermissions
    );

    // To Do - $scope.s.retailer.canManageRoles()
    return (
      modifiedPermissions.length && (isCashierRole(this.state.role) || true)
    );
  }

  handleSave = async e => {
    e.preventDefault();
    var resolvedPermissions = Object.keys(this.permissionGroupRef)
      .map(key => this.permissionGroupRef[key])
      .map(permissionGroup => permissionGroup.getPermissionsGroup());

    if (!this.canSave(resolvedPermissions)) {
      return;
    }

    const permissions = rbRolePermissionsResolver
      .getPermissionsPayload(resolvedPermissions)
      .filter(permission => permission.value)
      .map(permission => permission.name);

    await this.props.saveRole(this.state.role.roleId, permissions);
    // the initial permissions set is not the same any more as the user has changed them by doing a save operation.
    // so we have to copy the new initial permission set
    this.setState({
      initialPermissions: cloneDeep(resolvedPermissions),
      resolvedPermissions
    });
    var { role } = this.state;
    role.updatedAt = new Date();
    this.setState({ role });
  };

  render() {
    return (
      <div>
        {this.state.state === STATE.inProgress && (
          <div className="up-page-loading">
            <RBLoader />
          </div>
        )}
        {this.state.state === STATE.ready && (
          <div>
            <RBSection>
              <RBHeader category="page">
                <RBSectionBack href="/setup/users/roles" />
                {this.state.role.name}
              </RBHeader>
            </RBSection>
            <form name="roleForm" noValidate>
              {this.state.mode === MODES.edit && (
                <RBSection type="action-bar">
                  <RBFlex flex flexJustify="between" flexAlign="center">
                    <div>
                      Change what a {this.state.role.name} can see and do across
                      assigned outlets.
                    </div>
                    <RBButton category="primary" onClick={this.handleSave}>
                      Save
                    </RBButton>
                  </RBFlex>
                </RBSection>
              )}
              {this.state.mode === MODES.view && (
                <RBSection type="secondary">
                  <RBFlex flex flexJustify="between" flexAlign="center">
                    <div>
                      See what an {this.state.role.name} can see and do across
                      assigned outlets.
                    </div>
                  </RBFlex>
                </RBSection>
              )}
              <RBSection>{/* To Do - Promo for advanced plan */}</RBSection>
              <RBSection classes="vd-mbl">
                {this.state.resolvedPermissions.map((permissionGroup, i) => (
                  <div key={i}>
                    <PermissionGroup
                      ref={c => (this.permissionGroupRef[i] = c)}
                      name={permissionGroup.name}
                      permissions={permissionGroup.permissions}
                      role={this.state.role}
                    />
                    {i !== this.state.resolvedPermissions.length - 1 && (
                      <hr className="vd-hr" />
                    )}
                  </div>
                ))}
              </RBSection>
            </form>
          </div>
        )}
        {this.state.state === STATE.error && (
          <Error message={MESSAGES.error.request} />
        )}
      </div>
    );
  }
}

export default connect(null, dispatch =>
  bindActionCreators(
    {
      fetchRoles,
      saveRole
    },
    dispatch
  )
)(ManageRole);
