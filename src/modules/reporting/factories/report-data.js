import rbReportingResource from '../reporting.resource';
import ReportView from './report-view';
import MakeQuerablePromise from '../../../utils/querablePromise';

export default class ReportData {
  static get(def, format) {
    var data, requestDef;
    data = new ReportData(def);
    data.loading = true;
    requestDef = def.toParams();
    data.promise = new Promise((resolve, reject) => {
      data._resolve = resolve;
      data._reject = reject;
    });
    data.promise = MakeQuerablePromise(data.promise);
    if (format === 'csv') {
      rbReportingResource
        .export(JSON.stringify(requestDef))
        .then(resp => {
          data.response = resp;
          data._resolve(resp);
        })
        .catch(error => {
          data._reject(error);
        });
    } else {
      rbReportingResource
        .report(JSON.stringify(requestDef))
        .then(table => {
          console.log('table', table);
          data.loading = false;
          data.table = table;
          data._resolve();
        })
        .catch(error => {
          data.loading = false;
          data._reject(error);
        });
    }
    return data;
  }

  constructor(def, period) {
    this.def = def;
    this.period = period;
  }

  view(title, aggregation) {
    return new ReportView({
      title: title,
      data: this,
      period: this.period,
      aggregation: aggregation
    });
  }

  then(s, f) {
    if (this.promise.isPending()) {
      return this.promise.then(s, f);
    } else if (this.promise.isFulfilled()) {
      return s(this);
    }
  }
}
