import STORES from '../stores';
import VERSIONED_ENTITIES from '../versioned-entities';
import storeManager from './store-manager';
import syncManager from './sync-manager';
import User from '../model/user';

var usersStore = storeManager.getStore(STORES.users),
  syncParams;

syncParams = {
  store: usersStore,
  entity: VERSIONED_ENTITIES.users,
  syncDeleted: true,
  model: User,
  key: 'userId'
};

export default class UsersManager {
  static get(userId) {
    return usersStore.get(userId);
  }

  static getAll() {
    return usersStore.getAll();
  }

  static sync() {
    return syncManager.syncStore(syncParams);
  }
}
