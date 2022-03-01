import VendNumber from 'vend-number';
const vn = VendNumber.vn;

export default class StocktakeCount {
  constructor(config) {
    config = config || {};
    this.order = config.order || new Date().getTime();
    this.stocktakeId = config.stocktakeId;
    this.productId = config.productId;
    this.name = config.name;
    this.highlight = config.highlight;
    this.quantity = config.quantity ? vn(config.quantity) : null;
  }

  getId() {
    return this.stocktakeId + '_' + this.order;
  }

  revive() {
    this.quantity = this.quantity !== null ? vn(this.quantity) : null;
  }

  toJson() {
    return {
      order: this.order,
      stocktakeId: this.stocktakeId,
      productId: this.productId,
      name: this.name,
      quantity: this.quantity ? this.quantity.toString() : null
    };
  }
}
