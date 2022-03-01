export default class ProductFilter {
  constructor(config) {
    config = config || {};
    this.id = config.id;
    this.name = config.name;
    this.deletedAt = config.deletedAt;
    this.version = config.version;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      deletedAt: this.deletedAt,
      version: this.version
    };
  }
}
