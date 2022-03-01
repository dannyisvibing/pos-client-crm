import map from 'lodash/map';
import some from 'lodash/some';
import forEach from 'lodash/forEach';
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
import flatMap from 'lodash/flatMap';
import concat from 'lodash/concat';
import filter from 'lodash/filter';
import rbPermissionStore from './permission.store';
import RBPermissionModel from './permission.model';
import { isAdminRole, isCashierRole } from '../../../modules/user';

class RBRolePermissionsResolver {
  constructor() {
    this._ALWAYS_EDITABLE_FOR_CASHIERS = [
      'sale.discount.manage',
      'sale.return.process',
      'store_credit.issue.return'
    ];
  }

  /**
   * Sets permission groups' values for admins given an array of permissions groups.
   *
   * @method _resolveAdminGroupPermissions
   * @private
   *
   * @param  {Array<RBPermissionGroupModel>} permissionGroups
   *         the array of permissionGroups.
   *
   * @return {Array<RBPermissionGroupModel>} the modified array of
   *         permissionGroups with resolved permissions' values.
   */
  _resolveAdminGroupPermissions(permissionGroups) {
    return map(permissionGroups, permissionsGroup => {
      permissionsGroup.permissions = this._resolveAdminPermissions(
        permissionsGroup.permissions
      );
      return permissionsGroup;
    });
  }

  /**
   * Sets the permissions' properties to be valued and enabled but not editable. Recursively iterates children too.
   *
   * @method _resolveAdminPermissions
   * @private
   *
   * @param  {Array<RBPermissionViewModel>} permissions
   *         the array of permissions to modify.
   *
   * @return {Array<RBPermissionViewModel>} the modified permissions array.
   */
  _resolveAdminPermissions(permissions) {
    return map(permissions, permission => {
      permission.value = true;
      permission.enabled = true;
      permission.editable = false;
      permission.description = this._getDescriptionForRole(
        permission.description,
        'Admin'
      );

      this._resolveAdminPermissions(permission.children);

      return permission;
    });
  }

  /**
   * Replaces the role placeholder in the description if one exists with the role name.
   *
   * @method _getDescriptionForRole
   * @private
   *
   * @param  {String} description
   *         the description string with the placeholder.
   *
   * @param  {String} roleName
   *         the name of the role to insert in the description.
   *
   * @return {String} the new description with the role name
   */
  _getDescriptionForRole(description, roleName) {
    if (description) {
      return description.replace(rbPermissionStore.ROLE_PLACEHOLDER, roleName);
    }
  }

  /**
   * Sets permission groups' values for non-admin roles given an array of
   * permissionGroups and the role.
   *
   * @method _resolveRolePermissions
   * @private
   *
   * @param  {Array<RBPermissionGroupModel>} permissionGroups
   *         the array of permissionGroups.
   *
   * @param  {RBRoleModel} role
   *         the role object.
   *
   * @return {Array<RBPermissionGroupModel>} the modified array of
   *         permissionGroups with resolved permissions' values.
   */
  _resolveRoleGroupPermissions(permissionGroups, role) {
    return map(permissionGroups, permissionsGroup => {
      this._resolveRolePermissions(permissionsGroup.permissions, role);
      return permissionsGroup;
    });
  }

  /**
   * Sets the permissions' properties based on the granted permissions from the role.
   *
   * @method _resolveRolePermissions
   * @private
   *
   * @param  {Array<RBPermissionViewModel>} permissions
   *         the permissions array to resolve
   *
   * @param  {RBRoleModel} role
   *         the role object.
   *
   * @return {Array<RBPermissionViewModel>} the resolved permissions array.
   */
  _resolveRolePermissions(permissions, role) {
    const grantedPermissions = role.permissions;
    return map(permissions, permission => {
      permission.value = this._isGranted(permission, grantedPermissions);
      permission.enabled = this.canChangePermission(
        permission,
        isCashierRole(role)
      );
      permission.description = this._getDescriptionForRole(
        permission.description,
        `a ${role.name}`
      );

      this._resolveRolePermissions(permission.children, role);

      return permission;
    });
  }

  /**
   * Determines if a permission is granted or not given an array of permissions and granted permissions.
   *
   * @method _isGranted
   * @private
   *
   * @param  {RBPermissionViewModel} permission
   *         the permission to check.
   *
   * @param  {Array<RBPermissionModel>} grantedPermissions
   *         the array of granted permissions
   * @return {Boolean} true if the permission is granted, false otherwise.
   */
  _isGranted(permission, grantedPermissions) {
    return some(
      grantedPermissions,
      value => permission.keys.indexOf(value.name) > -1
    );
  }

  /**
   * Determines if a permission is enabled or not. The 'discounts' and 'sale returns' permissions are always enabled
   * for a cashier role for all retailers. However, the other permissions depend on the retailer's plan.
   *
   * @method canChangePermission
   *
   * @param  {RBPermissionViewModel} permission
   *         the permission to check.
   *
   * @param  {Boolean} isCashier
   *         a flag to determine whether the role is a cashier or not.
   *
   * @return {Boolean} true if the permission is enabled, false otherwise.
   */
  canChangePermission(permission, isCashier) {
    const isAlwaysEditable = intersection(
      permission.keys,
      this._ALWAYS_EDITABLE_FOR_CASHIERS
    );
    const isEditableForCashier = !isEmpty(isAlwaysEditable) && isCashier;

    return isEditableForCashier || true;
    // To Do - retailer
    // return isEditableForCashier || this._retailer.canManageRoles()
  }

  /**
   * Returns promise that resolves to grouped permissions for a specific role,
   * computing whether each permission is editable, enabled and granted.
   *
   * @method resolvePermissions
   *
   * @param  {RBRoleModel} role
   *         the role object with its granted permissions.
   *
   * @return {Promise<Array<RBPermissionGroupModel>} an array of grouped
   *         permissions for the role
   */
  resolvePermissions(role) {
    const permissionGroups = rbPermissionStore.getAll();
    this._filterGroupPermissions(permissionGroups);

    if (isAdminRole(role)) {
      return this._resolveAdminGroupPermissions(permissionGroups);
    }

    return this._resolveRoleGroupPermissions(permissionGroups, role);
  }

  /**
   * Filter permissions for each permission group
   *
   * @method _filterGroupPermissions
   *
   * @private
   *
   * @param  {Array<RBPermissionGroupModel>} permissionGroups
   *         the array of permissionGroups.
   *
   * @return {Array<RBPermissionGroupModel>} the modified array of
   *         permissionGroups with resolved permissions' values.
   */

  _filterGroupPermissions(permissionGroups) {
    return map(permissionGroups, permissionsGroup => {
      permissionsGroup.permissions = this._filterPermissions(
        permissionsGroup.permissions
      );
    });
  }

  /**
   * Returns an array of permissions filtered
   *
   * @method _filterPermissions
   *
   * @private
   *
   * @param {Array<RBPermissionViewModel>}  permissions
   *
   * @return {Array<RBPermissionViewModel>} the filtered permissions array.
   */
  _filterPermissions(permissions) {
    // const featureManager = this._featureManager
    return filter(permissions, permission => {
      // To Do - feature manager
      // if (typeof permission.feature !== 'undefined') {
      //     return featureManager.get(permission.feature)
      // }

      return true;
    });
  }

  /**
   * Returns an array of editable permissions that are "ON" given an array of permissions groups.
   *
   * @method getPermissionsPayload
   *
   * @param  {RBPermissionGroupModel} permissionGroups
   *         the set of updated permission groups with their permissions.
   *
   * @return {Array<RBPermissionModel>} an array of permissions.
   */
  getPermissionsPayload(permissionGroups) {
    let savedPermissions = [];

    forEach(permissionGroups, permissionsGroup => {
      savedPermissions = concat(
        savedPermissions,
        this._getPermissionsForPayload(permissionsGroup.permissions)
      );
    });

    return savedPermissions;
  }

  /**
   * Returns a flat array of permission objects with a name attribute (required for API), given an array of
   * PermissionModel objects.
   *
   * @param {Array<RBPermissionModel>} permissions
   *        An array of permissions.
   *
   * @return {Array<Object>} a flat array of permission objects for the API.
   */
  _getPermissionsForPayload(permissions) {
    let savedPermissions = [];
    forEach(this._flattenPermissions(permissions), permission => {
      forEach(permission.keys, permissionKey => {
        if (permission.editable) {
          savedPermissions.push(
            new RBPermissionModel({
              name: permissionKey,
              value: permission.value ? 1 : 0
            })
          );
        }
      });
    });

    return savedPermissions;
  }

  /**
   * Returns a flat set of permissions by un-nesting children permissions.
   *
   * @param {Array<RBPermissionModel>} permissions
   *        An array of permissions.
   *
   * @return {Array<RBPermissionModel>} a flat array of permission objects.
   */
  _flattenPermissions(permissions) {
    let flatPermissions = [];
    forEach(permissions, permission => {
      flatPermissions.push(permission);
      if (permission.children) {
        flatPermissions = concat(
          flatPermissions,
          this._flattenPermissions(permission.children)
        );
      }
    });

    return flatPermissions;
  }

  /**
   * Returns an array of permission key strings from a permissions group model.
   *
   * @method _getEditableKeys
   * @private
   *
   * @param  {Array<RBPermissionGroupModel>} groups
   *         the permission groups containing the permissions.
   *
   * @return {Array<String>} an array of permission key strings
   */
  _getEditableKeys(groups) {
    return flatMap(groups, group => {
      const flatPermissions = this._flattenPermissions(group.permissions);
      return flatMap(flatPermissions, permission => {
        return permission.value && permission.editable ? permission.keys : [];
      });
    });
  }

  /**
   * Returns the different permissions between the two permission groups.
   *
   * @method getModifiedPermissions
   *
   * @param  {Array<RBPermissionGroupModel>} initialPermissions
   *         the initial permission groups when the edit role page was loaded
   *
   * @param  {Array<RBPermissionGroupModel>} modifiedPermissions
   *         the modified permission groups after the role permissions were edited
   *
   * @return {Array<Objects>} an array of objects containing the permission key and value
   */
  getModifiedPermissions(initialPermissions, modifiedPermissions) {
    const initialOnPermissions = this._getEditableKeys(initialPermissions);
    const savedOnPermissions = this._getEditableKeys(modifiedPermissions);
    const offPermissions = difference(initialOnPermissions, savedOnPermissions);
    const onPermissions = difference(savedOnPermissions, initialOnPermissions);

    return concat(
      map(onPermissions, key => {
        return { name: key, value: 1 };
      }),
      map(offPermissions, key => {
        return { name: key, value: 0 };
      })
    );
  }
}

const rbRolePermissionsResolverInstance = new RBRolePermissionsResolver();
export default rbRolePermissionsResolverInstance;
