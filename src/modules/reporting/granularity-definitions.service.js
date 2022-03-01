import _ from 'lodash';
import OrderedHash from '../../utils/orderedHash';
import DefaultGranularityDefinition from './factories/default-granularity-definition';

var definitions;
definitions = {
  granularities: new OrderedHash()
};
definitions.addGranularity = function(granularity) {
  return this.granularities.push(granularity.key, granularity);
};
definitions.addGranularities = function(granularitiesArray) {
  return granularitiesArray.map(granularity =>
    this.addGranularity(granularity)
  );
};
definitions.all = function() {
  return _.map(this.granularities.array(), 'val');
};
definitions.findByKey = function(key) {
  return (
    _.find(this.granularities.vals(), {
      key: key
    }) || this['default']()
  );
};
definitions['default'] = function() {
  return (
    _.find(this.granularities.vals(), 'default') ||
    (function() {
      throw new Error('Default granularity not defined');
    })()
  );
};
definitions.addGranularities(DefaultGranularityDefinition);
export default definitions;
