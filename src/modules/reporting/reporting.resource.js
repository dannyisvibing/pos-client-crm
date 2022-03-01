import request from '../../utils/http';

export default class RegisterResource {
  static config() {
    return request({
      url: '/reporting/config'
    }).then(response => response.data);
  }

  static entities(params) {
    return request({
      url: '/reporting/entities',
      params
    }).then(response => response.data);
  }

  static report(params) {
    return request({
      url: '/reporting/report',
      params: { params }
    }).then(response => response.data);
  }

  static reports(definitions) {
    var params = JSON.stringify(definitions);
    return request({
      url: '/reporting/reports',
      params: { params }
    }).then(response => response.data);
  }

  static export(params) {
    return request({
      url: '/reporting/export',
      params: { params },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/csv'
      }
    });
  }
}
