import _ from 'lodash';

import AggregateDefinitionsService from '../aggregate-definitions.service';

function dimensionMetadataBuilder(d) {
  return {
    key: d.key,
    metadata: d.metadata || []
  };
}

function filterClientDimensions(dimensions) {
  return _.filter(dimensions, function(d) {
    return d.clientOnly !== true;
  });
}

export default class QueryDefinition {
  constructor(report, granularitySelection, order, from, size, constraints) {
    var filter, filteredRowDimensions, _i, _len, _ref;
    this.report = report;
    this.granularitySelection = granularitySelection;
    this.order = order;
    this.from = from != null ? from : 0;
    this.size = size;
    this.constraints = constraints != null ? constraints : [];
    this.aggregates = {};
    this.aggregates.cell = AggregateDefinitionsService.keySet(
      this.report.aggregates.cell
    );
    this.aggregates.row = AggregateDefinitionsService.keySet(
      this.report.aggregates.row
    );
    this.aggregates.column = AggregateDefinitionsService.keySet(
      this.report.aggregates.column
    );
    this.aggregates.table = AggregateDefinitionsService.keySet(
      this.report.aggregates.table
    );
    filteredRowDimensions = filterClientDimensions(this.report.dimensions.row);
    this.constraints = _.cloneDeep(this.constraints);
    this.dimensions = {
      row: _.map(filteredRowDimensions, dimensionMetadataBuilder),
      column: _.map(this.report.dimensions.column, dimensionMetadataBuilder)
    };
    if (report.filters) {
      _ref = this.report.filters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        this.constraints.push(filter);
      }
    }
    return null;
  }

  addDimension(axis, dimension) {
    return (this.dimensions[axis] = this.dimensions[axis].concat(
      _.map([dimension], dimensionMetadataBuilder)
    ));
  }

  /**
   * setOrderPeriod will set the supplied period for ordering on.
   */
  setOrderPeriod(period) {
    var i, _i, _len, _ref;
    _ref = this.order;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      this.order[i].period = period;
    }
    return null;
  }

  toParams() {
    var constraints, params, periods;
    periods = [];
    if (this.report.hasDateFilter() && this.granularitySelection.period) {
      periods.push(this.granularitySelection.getQueryPeriod());
    }
    constraints = _.map(this.constraints, function(constraint) {
      return {
        id: constraint.id,
        type: constraint.type
      };
    });
    params = {
      dimensions: this.dimensions,
      aggregates: this.aggregates,
      constraints: constraints,
      order: this.order,
      from: this.from,
      size: this.size,
      periods: periods
    };
    return params;
  }
}
