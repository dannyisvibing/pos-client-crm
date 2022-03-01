export default class Version {
  constructor(config) {
    config = config || {};

    this.entity = config.entity;
    this.version = config.version;
  }
}
