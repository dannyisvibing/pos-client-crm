import request from '../../utils/http';
import _ from 'lodash';
import { USER } from '../../constants/entityModels';
import { userIdSelector as activeUserIdSelector } from '../auth';
import { usersSelector } from './index';
import WindowDelegate from '../../rombostrap/utils/windowDelegate';
import { usersManager } from '../idb/managers';

export const fetchUsers = async () => {
  const windowDelegate = WindowDelegate.getInstance();
  if (windowDelegate.isOnline()) {
    const response = await request({
      url: '/users'
    });
    const result = response.data;
    return result.data;
  } else {
    return usersManager.getAll();
  }
};

export const getUserById = (state, userId) => {
  const allUsers = usersSelector(state);
  const user = _.find(allUsers, { userId });
  return refineUser(user);
};

export const getActiveUser = state => {
  const activeUserId = activeUserIdSelector(state);
  return getUserById(state, activeUserId);
};

export const refineUser = (raw = {}) => {
  return _(raw)
    .pick(_.keys(USER))
    .omitBy(_.isNull)
    .defaults(USER)
    .value();
};

export const filterUsers = (state, users, filter) => {
  console.log('filter users', users);
  const { query, role, outletId } = filter;
  return _(users)
    .filter(user => {
      const isCanView = canView(state, user) && !user.deletedAt;

      if (!isCanView) {
        return false;
      }

      const searchFields = ['displayName', 'username', 'userEmail'];

      if (query) {
        let matchesQuery;
        const lowerCaseQuery = query.toLowerCase();
        _.forEach(searchFields, field => {
          if (
            user[field] &&
            user[field].toLowerCase().indexOf(lowerCaseQuery) > -1
          ) {
            matchesQuery = true;
          }
        });

        if (!matchesQuery) {
          return false;
        }
      }

      if (role && !(user.accountType === role)) {
        return false;
      }

      if (outletId) {
        let matchesOutlet = user.restrictedOutletIds.length
          ? user.restrictedOutletIds.indexOf(outletId) > -1
          : true;

        if (!matchesOutlet) {
          return false;
        }
      }

      return true;
    })
    .orderBy(['username'], ['asc'])
    .value();
};

/**
 * Asserts whether userA and userB shares at least one outlet
 *
 * @param  {RbUserModel} userA
 * @param  {RbUserModel} userB
 *
 * @return {Boolean}
 */
export const shareOutlets = (userA, userB) => {
  if (!userA.restrictedOutletIds.length || !userB.restrictedOutletIds.length) {
    return true;
  }

  if (
    _.intersection(userA.restrictedOutletIds, userB.restrictedOutletIds).length
  ) {
    return true;
  }

  return false;
};

export const hasPermission = (state, permission, userId) => {
  let user;
  if (!userId) {
    user = getUserById(state, activeUserIdSelector(state));
  } else {
    user = getUserById(state, userId);
  }
  return user.permissions.indexOf(permission) !== -1;
};

/**
 * Asserts whether the active user has credentials to see another user
 *
 * @method canView
 *
 * @param {RbUserModel} user
 *        The user to be viewed
 *
 * @return {Boolean} True if the given user can be viewed by the active user.
 */
export const canView = (state, user) => {
  const activeUser = getUserById(state, activeUserIdSelector(state));
  switch (activeUser.accountType) {
    case 'admin':
      return true;
    case 'cashier':
      return activeUser.userId === user.userId;
    case 'manager':
      if (user.accountType === 'admin') {
        return false;
      }
      break;
    default:
      return false;
  }

  return shareOutlets(activeUser, user);
};

/**
 * Asserts whether the active user has credentials to manage users
 *
 * @method canManageUsers
 *
 * @return {Boolean} True if the active user can manage users
 */
export const canManageUsers = state => {
  return hasPermission(state, 'user.add_edit');
};

/**
 * Asserts whether the active user has credentials to delete users
 *
 * @method canDeleteUser
 *
 * @param {RbUserModel} user
 *        The user to be deleted
 *
 * @return {Boolean} True if the active user can delete users
 */
export const canDeleteUser = (state, user) => {
  const activeUser = getUserById(state, activeUserIdSelector(state));
  const sameHierarchy = activeUser.accountType === 'admin';

  if (user.isPrimaryUser || user.userId === activeUser.userId) {
    return false;
  }

  return _hasPermissionOnUser(state, 'user.delete', user, sameHierarchy);
};

/**
 * Asserts whether the active user has credentials to modify outlets assigned to users
 *
 * @method canManageUserOutlets
 *
 * @param {RbUserModel} user
 *        The user to be managed
 *
 * @return {Boolean} True if the active user can manage user-outlet assignations
 */
export const canManageUserOutlets = (state, user) => {
  const activeUser = getUserById(state, activeUserIdSelector(state));
  // A user can not manage their own outlets.
  if (user.userId === activeUser.userId) {
    return false;
  }

  const activeUserRestrictedOutlets = activeUser.restrictedOutletIds;
  // Which outlets the user has access to, that the active user does not.
  const userAdditionalOutlets = _.difference(
    user.restrictedOutletIds,
    activeUserRestrictedOutlets
  );

  // If the active user has more outlet restrictions than the user being edited, they should not be able to edit.
  if (activeUserRestrictedOutlets.length && userAdditionalOutlets.length) {
    return false;
  }

  // If the active user has outlet restrictions and the user being edited does not, the active user can not manage
  // the user's outlets
  if (activeUserRestrictedOutlets.length && !user.restrictedOutletIds.length) {
    return false;
  }

  return _isHigherThan(state, user) > 0;
};

/**
 * Asserts whether the active user has credentials to manage roles
 *
 * @method canManageRoles
 *
 * @return {Boolean} True if the active user can manage roles
 */
export const canManageRoles = state => {
  return hasPermission(state, 'roles.manage');
};

/**
 * Asserts whether the active user has credentials to manage price books
 *
 * @method canManagePriceBooks
 *
 * @return {Boolean} True if the active user can manage price books
 */
export const canManagePriceBooks = state => {
  return hasPermission(state, 'product.price_book.manage');
};

/**
 * Asserts whether the active user has permission to perform an action over another user
 *
 * @method hasPermissionOnUser
 *
 * @param {String} permission
 *        The permission key to be checked
 *
 * @param {RbUserModel} user
 *        The user to be checked with
 *
 * @param {Boolean} [sameHierarchy=false]
 *        Whether the action can be performed on roles with same hierarchy
 *        By default requires a higher role
 *
 * @return {Boolean} True if the active user has permission to execute the command
 */
const _hasPermissionOnUser = (
  state,
  permission,
  user,
  sameHierarchy = false
) => {
  if (!hasPermission(state, permission)) {
    return false;
  }
  return _isHigherThan(state, user) + (sameHierarchy ? 1 : 0) > 0;
};

/**
 * Asserts whether the active user has a higher, same or lower hierarchy than another user
 *
 * @private
 * @method isHigherThan
 *
 * @param {RbUserModel} user
 *        The user to be checked with
 *
 * @return {Number} 1 if higher, 0 if same, -1 if lower
 */
const _isHigherThan = (state, user) => {
  const activeUser = getUserById(state, activeUserIdSelector(state));

  if (activeUser.accountType === user.accountType) {
    return 0;
  }

  if (activeUser.accountType === 'admin') {
    return 1;
  }

  if (activeUser.accountType === 'cashier') {
    return -1;
  }

  // Active user can only be a manager
  return user.accountType === 'admin' ? -1 : 1;
};

export const isActiveUser = (state, user) => {
  return activeUserIdSelector(state).userId === user.userId;
};

export const isAdminRole = (role = {}) => {
  return role.name && role.name.toLowerCase() === 'admin';
};

export const isCashierRole = (role = {}) => {
  return role.name && role.name.toLowerCase() === 'cashier';
};

export const getUserDisplayName = user => {
  return user.displayName || user.username || user.userEmail;
};

export const getAccountType = user => {
  switch (user.accountType) {
    case 'admin':
      return 'Admin';
    case 'manager':
      return 'Manager';
    case 'cashier':
      return 'Cashier';
    default:
      break;
  }
};

export const getUserEmail = user => {
  return user.userEmail;
};
