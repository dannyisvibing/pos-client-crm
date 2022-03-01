export default class RBPermissionGroupModel {
  /**
   * @constructor
   * @param config {Object}
   *        @param {String} name
   *               The name of the permission group.
   *
   *        @param {Array} permissions
   *               The permissions associated with the permission group.
   */
  constructor(config = {}) {
    this.name = config.name;
    this.permissions = config.permissions;
  }
}
