import _ from 'lodash';
import storeManager from './store-manager';
import versionedEntityFetchManager from './versioned-entity-fetch-manager';
import STORES from '../stores';
import Version from '../model/version';
import request from '../../../utils/http';
import APIs from '../../../constants/api';

var syncing = {},
  maxVersions = {},
  versionsStore;

versionsStore = storeManager.getStore(STORES.versions);

export default class SyncManager {
  /**
   * Requests the API for last versions for entities.
   */
  static requestMaxVersions() {
    return request({
      url: APIs.versions
    }).then(response => {
      maxVersions = response.data;
    });
  }

  /**
   * Get last synced version number for a particular entity.
   * @param {String} entity Name of the entity to update the version
   */
  static getLastSyncedVersion(entity) {
    return versionsStore
      .get(entity)
      .then(function(lastSyncedVersion) {
        return lastSyncedVersion && lastSyncedVersion.version
          ? lastSyncedVersion.version
          : 0;
      })
      .catch(function() {
        return 0;
      });
  }

  static updateVersion(entity, version) {
    if (window.SIMULATE_SYNC) {
      return Promise.resolve();
    } else {
      return this.getLastSyncedVersion(entity).then(function(lastVersion) {
        if (lastVersion < version) {
          return versionsStore.insert(
            entity,
            new Version({
              version: version
            })
          );
        } else {
          return lastVersion.version;
        }
      });
    }
  }

  static requiresSync(entity) {
    if (window.SIMULATE_SYNC) {
      return Promise.resolve(0);
    } else {
      return this.getLastSyncedVersion(entity).then(function(
        lastSyncedVersion
      ) {
        if (maxVersions[entity]) {
          return lastSyncedVersion < maxVersions[entity]
            ? lastSyncedVersion
            : -1;
        } else {
          return lastSyncedVersion;
        }
      });
    }
  }

  static syncAndGetAll(config) {
    var store = config.store;

    return this.syncStore(config).then(function() {
      return store.getAll();
    });
  }

  static syncStore(params) {
    var entity = params.entity;
    if (!syncing[entity]) {
      return this.requiresSync(entity).then(lastSyncedVersion => {
        console.log('Sync store', entity, lastSyncedVersion);
        if (lastSyncedVersion > -1) {
          params.apiParams = params.apiParams || {};
          params.apiParams.after = lastSyncedVersion;
          params.apiParams.deleted =
            lastSyncedVersion || params.syncDeleted ? true : false;
          syncing[entity] = this._doSyncStore(params)
            .then(function(records) {
              syncing[entity] = null;
              return records;
            })
            .catch(function(response) {
              syncing[entity] = null;
              return Promise.reject();
            });

          return syncing[entity];
        }
      });
    }

    return syncing[entity];
  }

  static _doSyncStore(params) {
    return versionedEntityFetchManager.fetchPage(params).then(
      function(response) {
        var version = response.version,
          entity = params.entity,
          records = [],
          apiParams = params.apiParams,
          promise;

        if (window.SIMULATE_SYNC) {
          return this._storePage(response, params).then(function(
            storeResponse
          ) {
            return storeResponse;
          });
        } else {
          if (version.max !== null) {
            apiParams.after = version.max;

            setTimeout(() => {
              promise = this._doSyncStore(params).then(function(response) {
                return records.concat(response);
              });
            }, 0);

            return this._storePage(response, params).then(function(
              storeResponse
            ) {
              return promise.then(function(records) {
                return records.concat(storeResponse);
              });
            });
          } else {
            delete syncing[entity];
            return [];
          }
        }
      }.bind(this)
    );
  }

  static _storePage(response, params) {
    var manager = this,
      store = params.store,
      model = params.model,
      filter = params.filter,
      entity = params.entity,
      extraObjectData = params.extraObjectData,
      key = params.key || 'id',
      entities = {};

    _.forEach(response.data, function(record) {
      var object = new model(_.merge(record, extraObjectData), true);
      if (!filter || (filter && filter(record))) {
        if (!params.syncDeleted && record.deletedAt) {
          entities[object[key]] = null;
        } else {
          entities[object[key]] = object;
        }
      }
    });

    return store
      .batch(entities)
      .then(function(insertedRecords) {
        return manager
          .updateVersion(entity, response.version.max)
          .then(function() {
            if (params.pageSuccess) {
              params.pageSuccess(insertedRecords);
            }

            return insertedRecords;
          });
      })
      .catch(function(error) {
        console.log('_storePage', error);
      });
  }
}
