/* eslint-disable */
import _ from 'lodash';
import Database from './database';

export default class EntityStore {
  constructor(storeName, storeModel) {
    this.store = Database.store(storeName);
    this.model = storeModel;
    this.storeName = storeName;
  }

  /**
   * Retrieve all the records in a certain store.
   *
   * @method getAll
   * @param {Boolean} revive = true
   */
  getAll(revive) {
    var store = this,
      promise,
      _resolve,
      _reject,
      retn;

    if (typeof revive === 'undefined') {
      revive = true;
    }

    promise = new Promise((resolve, reject) => {
      (_resolve = resolve), (_reject = reject);
    });
    this.store.all((error, records) => {
      if (!error) {
        retn = revive
          ? _.map(records, store._unserializeObject.bind(this))
          : records;
        _resolve(retn);
      } else {
        _reject(error);
      }
    });
    return promise;
  }

  /**
   * Retrieves a record given its id
   * @param {String} id
   */
  get(id) {
    var promise, _resolve, _reject, retn;

    promise = new Promise((resolve, reject) => {
      (_resolve = resolve), (_reject = reject);
    });
    this.store.get(id, (error, record) => {
      if (!error) {
        retn = this._unserializeObject(record);
        _resolve(retn);
      } else {
        _reject(error);
      }
    });
    return promise;
  }

  /**
   * Retrieves a batch of record given an array of ids
   * @param {Array} ids
   */
  getBatch(ids) {
    var store = this,
      _resolve,
      _reject;
    var defered = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    this.store.db.transaction('readonly', [this.storeName], (err, tr) => {
      var promises = [];
      if (err) {
        _reject();
      }
      _.forEach(ids, id => {
        var req = tr.objectStore(this.storeName).get(id);
        var __resolve, __reject;
        var promise = new Promise((resolve, reject) => {
          (__resolve = resolve), (__reject = reject);
        });
        promises.push(promise);
        req.onsuccess = e => {
          __resolve(store._unserializeObject(e.target.result));
        };
        req.onerror = () => {
          __reject(null);
        };
      });
      Promise.all(promises).then(items => {
        _resolve(items);
      });
    });
    return defered;
  }

  /**
   * Perform write/delete batch operations
   * @param {Object} records An object of records to update/delete/create
   */
  batch(records) {
    var promise, _resolve, _reject;
    var serializedRecords = _.mapValues(
      records,
      function(record) {
        return record ? this._serializeObject(record) : null;
      }.bind(this)
    );
    promise = new Promise((resolve, reject) => {
      (_resolve = resolve), (_reject = reject);
    });
    this.store.batch(serializedRecords, error => {
      if (!error) {
        var insertedRecords = [];
        _.forEach(records, function(data) {
          if (data) {
            insertedRecords.push(data);
          }
        });
        _resolve(insertedRecords);
      } else {
        _reject(error);
      }
    });
    return promise;
  }

  getByIndex(index, value) {
    var store = this,
      indexedStore = this.store.index(index),
      promise,
      _resolve,
      _reject,
      retn;
    promise = new Promise((resolve, reject) => {
      (_resolve = resolve), (_reject = reject);
    });
    indexedStore.get(value, (error, records) => {
      if (!error) {
        retn = _.map(records, store._unserializeObject.bind(this));
        _resolve(retn);
      } else {
        _reject(error);
      }
    });
    return promise;
  }

  /**
   * Removes all functions from an object and calls internal toJson() method
   * @param {Object} object the object to be converted to JSON
   */
  _serializeObject(object) {
    var serializedObject;

    if (object.toJson) {
      serializedObject = object.toJson();
    } else {
      serializedObject = object;
    }

    return serializedObject;
  }

  /**
   * Revives a stored json adding back its methods and calling revive() internal method
   * @param {Object} object The object to be revived from JSON
   */
  _unserializeObject(object) {
    var liveObject = object ? new this.model(object) : null;

    if (liveObject && liveObject.revive) {
      liveObject.revive();
    }

    return liveObject;
  }

  insert(id, record) {
    var serializedObject = this._serializeObject(record),
      promise,
      _resolve,
      _reject;

    promise = new Promise((resolve, reject) => {
      (_resolve = resolve), (_reject = reject);
    });
    this.store.put(id, serializedObject, error => {
      !error ? _resolve(record) : _reject(error);
    });
    return promise;
  }

  delete(id) {
    var promise, _resolve, _reject;

    promise = new Promise((resolve, reject) => {
      (_resolve = resolve), (_reject = reject);
    });
    this.store.del(id, error => {
      !error ? _resolve() : _reject(error);
    });
    return promise;
  }

  clear() {
    var promise, _resolve, _reject;

    promise = new Promise((resolve, reject) => {
      (_resolve = resolve), (_reject = reject);
    });
    this.store.clear(error => {
      !error ? _resolve() : _reject(error);
    });
    return promise;
  }
}
