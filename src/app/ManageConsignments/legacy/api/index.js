import request from '../../../../utils/http';

export default class ConsignmentResource {
  static create(detail) {
    return request({
      url: '/legacyConsignments/create',
      body: { detail },
      method: 'post'
    }).then(response => response.data);
  }

  static update(id, isItemsUpdate, data) {
    return request({
      url: '/legacyConsignments/update',
      method: 'put',
      body: { id, isItemsUpdate, data }
    }).then(response => response.data);
  }

  static get(filters) {
    var params = JSON.stringify(filters);
    return request({
      url: '/legacyConsignments',
      params: { params }
    }).then(response => response.data);
  }

  static addItem(productId, consignmentId) {
    return request({
      url: '/legacyConsignments/add-item',
      method: 'post',
      body: { productId, consignmentId }
    }).then(response => response.data);
  }

  static removeItem(productId) {
    return request({
      url: '/legacyConsignments/remove-item',
      method: 'delete',
      params: { id: productId }
    }).then(response => response.data);
  }

  static perform(id, options) {
    return request({
      url: '/legacyConsignments/perform',
      method: 'post',
      body: { id, options }
    }).then(response => response.data);
  }
}
