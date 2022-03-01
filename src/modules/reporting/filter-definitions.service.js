import _ from 'lodash';

var service;
service = {
  filters: {},
  addFilter: function(filter) {
    return (this.filters[filter.key] = filter);
  },
  addFilters: function(filters) {
    var filter, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = filters.length; _i < _len; _i++) {
      filter = filters[_i];
      _results.push(this.addFilter(filter));
    }
    return _results;
  },
  toArray: function() {
    return _.sortBy(
      _.map(this.filters, function(f) {
        return f;
      }),
      'name'
    );
  },
  limit: function(report) {
    return _.filter(this.toArray(), function(filter) {
      return _.indexOf(filter.limit, report.type) >= 0;
    });
  },
  findByKey: function(key) {
    return this.filters[key];
  }
};

export default service;
