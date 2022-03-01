import React, { Component } from 'react';
import classnames from 'classnames';
import forEach from 'lodash/forEach';
import { RBCheckbox, RBRadio, RBFlex } from '../../../../rombostrap';
import rbRolePermissionsResolve from '../../utils/rolePermissions.resolver';
import { isCashierRole } from '../../../../modules/user';

class Permission extends Component {
  state = {};

  componentWillMount() {
    const { permission, role } = this.props;

    this.setState({
      originalPermissionValue: permission.value,
      value: permission.value,
      isCashier: isCashierRole(role),
      children: permission.children
    });

    this.permissionRef = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      originalPermissionValue: nextProps.permission.value,
      value: nextProps.permission.value,
      children: nextProps.permission.children
    });
  }

  handlePermissionValueChange = newValue => {
    const { permission } = this.props;
    const { value: oldValue, originalPermissionValue, isCashier } = this.state;
    const originalValueChanged = newValue !== originalPermissionValue;
    // prevent changing value if user is on a restricted plan.
    // if the value is changed by the user for a disabled permission then revert it.
    // we do this because of the angular two-way binding of value with the model.
    if (
      originalValueChanged &&
      !rbRolePermissionsResolve.canChangePermission(permission, isCashier)
    ) {
      this.setState({ value: originalPermissionValue });
    } else {
      this.setState({ value: newValue });
    }

    // enable/disable any child permissions when the value of the parent changes.
    if (permission.children) {
      if (newValue !== oldValue) {
        this._setChildrenState(newValue, permission.enabled);
      } else if (!newValue) {
        // this ensures on load the children are disabled if their parent is off.
        this._setChildrenState(false);
      }
    }
  };

  /**
   * Set the enabled and value states for the permissions children.
   *
   * @method _setChildrenState
   * @private
   *
   * @param  {Boolean} isParentEnabled
   *         a flag to set the value for the enabled state for the child permission.
   */
  _setChildrenState = (parentValue, isParentEnabled) => {
    var { children } = this.state;
    forEach(children, child => {
      if (!parentValue || (isParentEnabled && !child.enabled)) {
        child.value = false;
      }
      child.enabled = parentValue && isParentEnabled;
    });
    this.setState({ children });
  };

  getPermission() {
    const { permission } = this.props;

    var children = [];
    if (permission.children) {
      for (var i = 0; i < permission.children.length; i++) {
        children.push(this.permissionRef[i].getPermission());
      }
    }

    var permissionChanged = {
      ...permission,
      value: this.state.value,
      children: children
    };

    return permissionChanged;
  }

  render() {
    const { permission, role } = this.props;
    const { value, children } = this.state;
    return (
      <div>
        {!permission.radio &&
          permission.editable && (
            <RBCheckbox
              classes="vd-pls"
              label={permission.name}
              description={permission.description}
              disabled={!permission.enabled}
              checked={value}
              onChange={e => this.handlePermissionValueChange(e.target.checked)}
            />
          )}
        {permission.radio &&
          permission.editable && (
            <RBFlex flex flexDirection="column">
              <div>
                <RBRadio
                  label={permission.offLabel}
                  disabled={!permission.enabled}
                  value="0"
                  checked={!value}
                  onChange={() => this.handlePermissionValueChange(false)}
                />
              </div>
              <div className="vd-mtm">
                <RBRadio
                  label={permission.onLabel}
                  disabled={!permission.enabled}
                  value="1"
                  checked={value}
                  onChange={() => this.handlePermissionValueChange(true)}
                />
              </div>
            </RBFlex>
          )}
        {!permission.editable && (
          <RBFlex
            flex
            classes={classnames({
              'up-role-permission--disabled': !permission.value
            })}
          >
            <span
              className={classnames('vd-pls fa-fw', {
                'fa fa-check': permission.value,
                'fa fa-times': !permission.value
              })}
            />
            <RBFlex flex flexDirection="column">
              {permission.radio && (
                <div className="vd-plm">{permission.onLabel}</div>
              )}
              <span className="vd-plm">{permission.name}</span>
              {permission.description && (
                <div className="vd-plm vd-ptm up-role-permission--disabled">
                  {permission.description}
                </div>
              )}
            </RBFlex>
          </RBFlex>
        )}
        {children &&
          children.map((childPermission, i) => (
            <div key={i} className="vd-plxl">
              <div className="vd-mtl">
                <Permission
                  ref={c => (this.permissionRef[i] = c)}
                  permission={childPermission}
                  role={role}
                />
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default Permission;
