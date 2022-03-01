import _ from 'lodash';

var reports;
reports = {
  reports: {}
};
reports.addReport = function(report) {
  return (this.reports[report.key] = report);
};
reports.addReports = function(reportsArray) {
  return reportsArray.map(report => this.addReport(report));
};
reports.toArray = function() {
  return _.sortBy(
    _.map(this.reports, function(r) {
      return r;
    }),
    'name'
  );
};
reports.all = function() {
  return this.reports;
};
reports.findByKey = function(key) {
  return this.reports[key] || this['default']();
};
reports['default'] = function() {
  return (
    _.find(this.reports, 'default') ||
    (function() {
      throw new Error('Default report not defined');
    })()
  );
};

export default reports;
