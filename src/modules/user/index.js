import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from '../../utils/http';
import {
  fetchUsers as _fetchUsers,
  refineUser,
  isActiveUser,
  canManageUsers,
  canManageRoles,
  canDeleteUser,
  canManageUserOutlets,
  canView,
  hasPermission,
  filterUsers,
  isAdminRole,
  isCashierRole,
  getUserDisplayName,
  getUserById,
  getActiveUser,
  getAccountType,
  getUserEmail
} from './user.logic';

export {
  isActiveUser,
  canManageUsers,
  canManageRoles,
  canDeleteUser,
  canManageUserOutlets,
  canView,
  hasPermission,
  filterUsers,
  getUserById,
  isAdminRole,
  isCashierRole,
  getUserDisplayName,
  getAccountType,
  getUserEmail
};

const initialState = {
  users: [],
  roles: []
};

// ==================================
// Selectors
// ==================================
const userReducerSelector = state => state.user;

export const usersSelector = createSelector(userReducerSelector, userReducer =>
  userReducer.users.map(user => refineUser(user))
);

export const activeUserSelector = getActiveUser;

export const rolesSelector = createSelector(
  userReducerSelector,
  userReducer => userReducer.roles
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('user/RESET');

export const fetchUsers = createAction('user/FETCH', _fetchUsers);

export const createUser = createAction('user/CREATE', user => {
  return request({
    url: '/users',
    method: 'post',
    body: { user }
  });
});

export const updateUser = createAction('user/UPDATE', user => {
  return request({
    url: `/users/${user.userId}`,
    method: 'put',
    body: { user }
  });
});

export const setTarget = createAction(
  'user/SET_TARGET',
  (userId, period, newValue) => {
    const user = {
      [`target_${period}`]: newValue
    };
    return request({
      url: `/users/${userId}`,
      method: 'put',
      body: { user }
    });
  }
);

export const fetchRoles = createAction('user/FETCH_ROLES', roleId => {
  return request({
    url: '/users/roles',
    params: { roleId }
  });
});

export const saveRole = createAction(
  'user/SAVE_ROLE',
  (roleId, permissions) => {
    return request({
      url: `/users/roles/${roleId}`,
      method: 'put',
      body: { permissions }
    });
  }
);

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [fetchUsers]: {
    next: (state, action) => {
      return {
        ...state,
        users: action.payload
      };
    },
    throw: state => state
  },
  [createUser]: {
    next: (state, action) => {
      const newUser = action.payload.data;
      return {
        ...state,
        users: [...state.users, newUser]
      };
    },
    throw: state => state
  },
  [updateUser]: {
    next: (state, action) => {
      const updatedUser = action.payload.data;
      return {
        ...state,
        users: [
          ...state.users.filter(user => user.userId !== updatedUser.userId),
          updatedUser
        ]
      };
    },
    throw: state => state
  },
  [fetchRoles]: {
    next: (state, action) => {
      const roles = action.payload.data;
      return {
        ...state,
        roles
      };
    },
    throw: state => state
  },
  [resetModule]: () => {
    return initialState;
  }
};

// ==================================
// Reducer
// ==================================
export default handleActions(ACTION_HANDLERS, initialState);
