import _ from 'lodash';

export default class OrderedHash {
  constructor(data) {
    if (data == null) {
      data = {};
    }
    this._keys = [];
    this._vals = {};

    _.forEach(data, (v, k) => {
      this.push(k, v);
    });
  }

  push(k, v) {
    if (!this._vals[k]) {
      this._keys.push(k);
    }
    return (this._vals[k] = v);
  }

  add(k, v) {
    if (!this._vals[k]) {
      this._keys.push(k);
      return (this._vals[k] = v);
    } else {
      return (this._vals[k] += v);
    }
  }

  length() {
    return this._keys.length;
  }

  at(i) {
    return this.val(this._keys[i]);
  }

  first() {
    return this.val(this._keys[0]);
  }

  last() {
    return this.val(this._keys[this._keys.length - 1]);
  }

  keys() {
    return this._keys;
  }

  val(k) {
    return this._vals[k];
  }

  vals() {
    return this._vals;
  }

  array() {
    return _.map(this._keys, k => ({
      key: k,
      val: this._vals[k]
    }));
  }
}
