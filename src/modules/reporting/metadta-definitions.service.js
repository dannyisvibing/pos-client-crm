import _ from 'lodash';
var __slice = [].slice;

var metadata;
metadata = {
  metadata: {}
};
metadata.addMetadata = function(metadata) {
  return (this.metadata[metadata.key] = metadata);
};
metadata.addMetadataCollection = function(metadataArray) {
  return metadataArray.map(metadata => this.addMetadata(metadata));
};
metadata.all = function() {
  return this.metadata;
};
metadata.findByKey = function(key) {
  return _.filter(this.metadata, function(val) {
    var filterRegex;
    filterRegex = new RegExp(val.key + '$');
    return filterRegex.test(key);
  })[0];
};
metadata['default'] = function() {
  return (
    _.find(this.metadata, 'default') ||
    (function() {
      throw new Error('Default metadata not defined');
    })()
  );
};
metadata.requiredForReport = function(report) {
  var reportDimensions;
  reportDimensions = _.map(report.dimensions.row, 'key');
  return _.filter(this.metadata, function(metadata) {
    if (!metadata.required) {
      return false;
    }
    return _.intersection(reportDimensions, metadata.dimensionKeys).length;
  });
};
metadata.forReport = function(report) {
  var reportDimensions;
  reportDimensions = _.map(report.dimensions.row, 'key');
  return _.filter(this.metadata, function(metadata) {
    if (metadata.required) {
      return false;
    }
    return _.intersection(reportDimensions, metadata.dimensionKeys).length;
  });
};
metadata.keySet = function() {
  var metadata, keys;
  metadata = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  metadata = _.flatten(metadata);
  keys = _.map(metadata, 'key');
  return _.uniq(keys);
};

export default metadata;
