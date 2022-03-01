import APIs from '../../../../constants/api';
import request from '../../../../utils/http';

function getUrl(id, productId) {
  return APIs.stocktakeItems
    .replace(':id', id || '')
    .replace(':productId', productId || '');
}

export default class StocktakeItemResource {
  static save(productData, stocktakeId) {
    return request({
      url: getUrl(stocktakeId),
      method: 'post',
      body: productData
    }).then(response => response.data);
  }

  static delete(stocktakeId, productId) {
    return request({
      url: getUrl(stocktakeId, productId),
      method: 'delete'
    }).then(response => response.data);
  }
}
