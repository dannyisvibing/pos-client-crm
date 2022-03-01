import _ from 'lodash';

import AggregateDefinitionsService from '../aggregate-definitions.service';
import DimensionDefinitionsService from '../dimension-definitions.service';

export default class ReportDefinition {
  constructor(attr) {
    if (attr == null) {
      attr = {};
    }
    _.defaults(this, attr);
    this.dimensions || (this.dimensions = {});
    this.aggregates || (this.aggregates = {});
    this.config = _.defaults(this.config || {}, {
      showDatePicker: true
    });
    this.constraints || (this.constraints = []);
  }

  aggregate(aggregate) {
    return (
      this.aggregates.cell[aggregate] ||
      (function() {
        throw new Error(
          'Aggregate.' + aggregate + 'not included in query definition'
        );
      })()
    );
  }

  hasDateFilter() {
    return _.some(this.config.datePicker, Boolean, true);
  }

  isSingleDateReport() {
    return Boolean(this.config.datePicker.single);
  }

  isInventoryReport() {
    return this.type === 'inventory';
  }

  isPPRReport() {
    return this.key === 'ppr';
  }

  isAggregateSelectableReport() {
    return !this.allAggregates;
  }

  static fromJSON(def) {
    var aggregates, dimensions;
    aggregates = {
      optional: [],
      cell: [],
      column: [],
      row: [],
      table: []
    };
    _.forEach(def.aggregates, function(values, type) {
      var key, _i, _len, _ref, _results;
      if (!values) {
        return true;
      }
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        key = values[_i];
        _results.push(
          (_ref = aggregates[type]) != null
            ? _ref.push(AggregateDefinitionsService.findByKey(key))
            : void 0
        );
      }
      return _results;
    });
    def.aggregates = aggregates;
    dimensions = {
      cell: [],
      column: [],
      row: [],
      rowOptional: [],
      table: []
    };
    _.forEach(def.dimensions, function(values, type) {
      var key, _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        key = values[_i];
        _results.push(
          (_ref = dimensions[type]) != null
            ? _ref.push(DimensionDefinitionsService.findByKey(key))
            : void 0
        );
      }
      return _results;
    });
    def.dimensions = dimensions;
    return new ReportDefinition(def);
  }
}
