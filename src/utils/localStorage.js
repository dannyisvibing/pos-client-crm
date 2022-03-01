/**
 * In-memory implementation of localStorage for use if localStorage is not available.
 *
 * @private
 * @class StubStorage
 */
class StubStorage {
  constructor() {
    this._items = {};
  }

  getItem(key) {
    return this._items[key];
  }

  setItem(key, value) {
    this._items[key] = value;
  }

  removeItem(key) {
    delete this._items[key];
  }

  clear() {
    this._items = {};
  }
}

/**
 * Service for Saving/Getting Data from localStorage. Automatically stringifies and parses data from JSON.
 *
 * @class rbLocalStorage
 * @constructor
 */
class LocalStorage {
  constructor() {
    // @To Do - Use Bugsnug to track bugs

    if (!LocalStorage.instance) {
      LocalStorage.instance = this;
      if (!('localStorage' in window) || window.localStorage === null) {
        this._localStorage = new StubStorage();
      } else {
        this._localStorage = window.localStorage;
      }
    }

    return LocalStorage.instance;
  }

  // ============================== Public API =============================== //

  /**
   * Save the given data against the given key. Always stringifies the data to JSON
   *
   * @method save
   *
   * @param  {String} key
   *         The key to store the data against
   *
   * @param  {Object} data
   *         The data to store
   */
  save(key, data) {
    try {
      this._localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      // Most likely iOS Safari in private browsing mode whereby localStorage is available but errors if you use it
    }
  }

  /**
   * Get the data stored against the given key and parse from JSON to original value
   *
   * @method get
   *
   * @param  {String} key
   *         The key to fetch the data for
   *
   * @return {Any} The data stored for the key or `undefined` if there is none
   */
  get(key) {
    const raw = this._localStorage.getItem(key);

    if (!raw) {
      // There is no data stored against this key, return undefined
      return;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return;
    }

    return data;
  }

  /**
   * Remove the data stored against the given key
   *
   * @method remove
   *
   * @param  {String} key
   *         The key to remove data from
   */
  remove(key) {
    try {
      this._localStorage.removeItem(key);
    } catch (e) {
      return;
    }
  }
}

const instance = new LocalStorage();
Object.freeze(instance);
export default instance;
