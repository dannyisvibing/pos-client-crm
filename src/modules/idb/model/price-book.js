export default class Pricebook {
  constructor(config = {}) {
    this.bookId = config.bookId;

    this.createdAt = config.createdAt;
    this.deletedAt = config.deletedAt;
    this.updatedAt = config.updatedAt;

    this.name = config.name;
    this.validOnInStore = config.validOnInStore;
    this.validOnEcommerce = config.validOnEcommerce;
    this.customerGroupId = config.customerGroupId;
    this.restrictedOutletId = config.restrictedOutletId;
    this.validFrom = config.validFrom;
    this.validTo = config.validTo;

    this.version = config.version;
  }
}
