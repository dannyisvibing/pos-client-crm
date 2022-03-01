export default class ProductTax {
  constructor(config = {}) {
    this.taxId = config.taxId;
    this.productId = config.productId;
    this.outletId = config.outletId;
    this.salestaxId = config.salestaxId;
    this.version = config.version;
  }
}
