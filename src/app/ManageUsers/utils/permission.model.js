export default class RBPermissionModel {
  /**
   * @constructor
   * @param config {Object}
   *        @param {String} name
   *               The API permission key.
   *
   *        @param {Boolean} value
   *               The permission value.
   */
  constructor(config = {}) {
    this.name = config.name;
    this.value = config.value;
  }
}
