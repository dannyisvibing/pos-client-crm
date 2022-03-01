import _ from 'lodash';
var __slice = [].slice;

var aggregates;
aggregates = {
  aggregates: {}
};
aggregates.addAggregate = function(aggregate) {
  return (this.aggregates[aggregate.key] = aggregate);
};
aggregates.addAggregates = function(aggregatesArray) {
  return aggregatesArray.map(aggregate => this.addAggregate(aggregate));
};
aggregates.toArray = function() {
  return _.sortBy(
    _.map(this.aggregates, function(r) {
      return r;
    }),
    'name'
  );
};
aggregates.all = function() {
  return this.aggregates;
};
aggregates.findByKey = function(key) {
  return this.aggregates[key];
};
aggregates['default'] = function() {
  return (
    _.find(this.aggregates, 'default') ||
    (function() {
      throw new Error('Default aggregate not defined');
    })()
  );
};
aggregates.forReport = function(report) {
  return _.filter(this.toArray(), function(agg) {
    return _.indexOf(agg.limit, report.type) >= 0;
  });
};
aggregates.keySet = function() {
  var aggregates, aggs, keys;
  aggregates = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  aggs = _.flatten(aggregates);
  keys = _.map(aggs, 'key');
  return _.uniq(keys);
};

export default aggregates;
