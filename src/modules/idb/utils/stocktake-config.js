import SETTINGS from '../../../constants/stocktake/settings';
var storage = window.localStorage;

export default class StocktakeConfig {
  static setDatabaseVersion(value) {
    storage.setItem(SETTINGS.databaseVersion, value);
  }

  static getDatabaseVersion() {
    return storage.getItem(SETTINGS.databaseVersion);
  }

  static setInitialSync(value) {
    storage.setItem(SETTINGS.initialSyncCompleted, value);
  }

  static unsetInitialSync() {
    storage.removeItem(SETTINGS.initialSyncCompleted);
  }

  static getInitialSync() {
    return storage.getItem(SETTINGS.initialSyncCompleted);
  }
}
