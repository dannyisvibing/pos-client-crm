export default class CustomerGroup {
  constructor(config = {}) {
    this.id = config.id;
    this.name = config.name;
    this.createdAt = config.createdAt;
    this.deletedAt = config.deletedAt;
    this.version = config.version;
  }
}
