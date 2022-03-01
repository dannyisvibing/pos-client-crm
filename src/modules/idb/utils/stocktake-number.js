import VendNumber from 'vend-number';
const vn = VendNumber.vn;

export default class StocktakeNumber {
  static getVendNumber(value) {
    return value && !isNaN(parseFloat(value)) ? vn(value) : null;
  }

  static getBigNumberValue(bigNumber, fractionSize) {
    if (!bigNumber) {
      return null;
    }

    fractionSize = typeof fractionSize !== 'undefined' ? fractionSize : 5;

    return bigNumber.toFixed(fractionSize);
  }
}
