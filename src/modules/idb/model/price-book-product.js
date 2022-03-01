export default class PriceBookProduct {
  constructor(config = {}) {
    this.itemId = config.itemId;
    this.bookId = config.bookId;
    this.productId = config.productId;
    this.markup = config.markup;
    this.discount = config.discount;
    this.retailPrice = config.retailPrice;
    this.loyaltyEarned = config.loyaltyEarned;
    this.minUnits = config.minUnits;
    this.maxUnits = config.maxUnits;
    this.version = config.version;
  }
}
