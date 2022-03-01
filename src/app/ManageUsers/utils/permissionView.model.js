export default class RBPermissionViewModel {
  /**
   * @constructor
   * @param config {Object}
   *        @param {String} name
   *               The displayed name of the permission.
   *
   *        @param {Boolean} value
   *               The permission value.
   *
   *        @param {String} [description]
   *               The description of the permission.
   *
   *        @param {Boolean} editable
   *               Whether the permission is editable or not.
   *
   *        @param {Boolean} enabled
   *               Whether the permission is enabled or not.
   *
   *        @param {Array<String>} keys
   *               Array of strings used to map API permissions.
   *
   *        @param {Array<UpPermissionViewModel>} children
   *               Array of chilren's permission keys that depend on the instantiated permission.
   *               Used to control the value and state of the child permission when the parent's value is turned off.
   *
   *        @param {String} feature
   *               the feature name that is related to this permission
   */
  constructor(config = {}) {
    this.name = config.name;
    this.value = config.value;
    this.description = config.description;
    this.editable = config.editable;
    this.enabled = config.enabled;
    this.keys = config.keys;
    this.feature = config.feature;
    this.children = config.children || [];
  }
}
