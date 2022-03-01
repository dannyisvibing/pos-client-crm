import _ from 'lodash';
var __slice = [].slice;

var dimensions;
dimensions = {
  dimensions: {}
};
dimensions.addDimension = function(dimension) {
  return (this.dimensions[dimension.key] = dimension);
};
dimensions.addDimensions = function(dimensionArray) {
  return dimensionArray.map(dimension => this.addDimension(dimension));
};
dimensions.all = function() {
  return this.dimensions;
};
dimensions.findByKey = function(key) {
  return this.dimensions[key];
};
dimensions.keySet = function() {
  var dimensions;
  dimensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  dimensions = _.flatten(dimensions);
  return _.map(dimensions, 'key');
};
dimensions.typeSet = function() {
  var dimensions;
  dimensions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  dimensions = _.flatten(dimensions);
  return _.pull(_.uniq(_.map(dimensions, 'type')), void 0);
};

export default dimensions;
