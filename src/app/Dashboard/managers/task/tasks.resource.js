import request from '../../../../utils/http';

export default class TasksResource {
  static getTasks(dueAt, outletId) {
    const params = { dueAt: dueAt.unix() };
    if (outletId) {
      params['outletId'] = outletId;
    }

    return request({
      url: '/dashboard/tasks',
      params
    }).then(response => response.data);
  }
}
