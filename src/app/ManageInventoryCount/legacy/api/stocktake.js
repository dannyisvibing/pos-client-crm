import APIs from '../../../../constants/api';
import request from '../../../../utils/http';

function getUrl(id) {
  return APIs.stocktakes.replace(':id', id || '');
}

export default class StocktakeResource {
  static get(stocktakeId) {
    return request({
      url: getUrl(stocktakeId)
    }).then(response => response.data);
  }

  static update(data, stocktakeId) {
    return request({
      url: getUrl(stocktakeId),
      method: 'put',
      body: data
    }).then(response => response.data);
  }

  static save(data) {
    data.type = 'stocktake';
    return request({
      url: getUrl(),
      method: 'post',
      body: data
    }).then(response => response.data);
  }

  static delete(stocktakeId) {
    return request({
      url: getUrl(stocktakeId),
      method: 'delete'
    }).then(response => response.data);
  }
}
