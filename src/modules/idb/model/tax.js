export default class Tax {
  constructor(config) {
    config = config || {};
    this.id = config.id;
    this.createdAt = config.createdAt;
    this.deletedAt = config.deletedAt;
    this.name = config.name;
    this.rate = config.rate;
    this.version = config.version;
  }
}
