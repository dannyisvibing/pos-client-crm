export default class RBPermissionViewRadioModel {
  /**
   * @constructor
   * @param config {Object}
   *        @param {String} onLabel
   *               The label to display for the on option.
   *
   *        @param {String} offLabel
   *               The label to display for the off option.
   *
   *        @param {Boolean} editable
   *               Whether the permission is editable or not.
   *
   *        @param {Boolean} enabled
   *               Whether the permission is enabled or not.
   *
   *        @param {Array<String>} keys
   *               Array of strings used to map API permissions.
   */
  constructor(config = {}) {
    this.radio = true;
    this.onLabel = config.onLabel;
    this.offLabel = config.offLabel;
    this.editable = config.editable;
    this.enabled = config.enabled;
    this.keys = config.keys;
  }
}
