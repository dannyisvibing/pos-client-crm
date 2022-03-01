export default class DimensionUrlService {
  static getUrl(dimensionKey, id, label) {
    if (label == null) {
      label = '';
    }
    if (id == null) {
      return null;
    }
    switch (dimensionKey) {
      case 'inventoryProduct':
      case 'inventoryProductVariant':
      case 'product':
      case 'productVariant':
        return '/product/' + id;
      case 'customer':
        if (label === 'WALKIN') {
          return null;
        } else {
          return '/customer/' + id;
        }
      case 'user':
        return '/history?user_id=' + id;

      default:
        return null;
    }
  }
}
