import request from '../../../../utils/http';

export default class ConsignmentAlertResource {
  static getData(type, outlet_id, endOfPeriod) {
    var params = { type, endOfPeriod };
    if (outlet_id) {
      params.outletId = outlet_id;
    }
    return request({
      url: '/dashboard/consignments-of-task',
      params
    }).then(response => response.data);
  }
}
