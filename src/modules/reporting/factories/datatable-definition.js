import _ from 'lodash';

import PersistedOptions from './persisted-options';
import OrderRule from './order-rule';

import ReportOptionsService from '../report-options.service';
import DimensionDefinitionsService from '../dimension-definitions.service';
import MetadataDefinitionsService from '../metadta-definitions.service';
import QueryDefinition from './query-definition';

var __bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

export default class DatatableDefinition {
  constructor(attrs) {
    this.constrainInactiveInventory = __bind(
      this.constrainInactiveInventory,
      this
    );
    this.includeGiftCardsTransformer = __bind(
      this.includeGiftCardsTransformer,
      this
    );
    this.groupVariantsTransformer = __bind(this.groupVariantsTransformer, this);
    this.includeProductsTransformer = __bind(
      this.includeProductsTransformer,
      this
    );
    this.orderValidityTransformer = __bind(this.orderValidityTransformer, this);
    this.includeSelectedMetricTransformer = __bind(
      this.includeSelectedMetricTransformer,
      this
    );
    this.includeMetadataTransformer = __bind(
      this.includeMetadataTransformer,
      this
    );
    this.includeOptionalAggregatesTransformer = __bind(
      this.includeOptionalAggregatesTransformer,
      this
    );
    this.excludeInvalidAggregatesTransformer = __bind(
      this.excludeInvalidAggregatesTransformer,
      this
    );
    this.applyGroupVariantsOrderRule = __bind(
      this.applyGroupVariantsOrderRule,
      this
    );
    this.applyProductOrderRule = __bind(this.applyProductOrderRule, this);

    _.merge(this, attrs);
    this.order || (this.order = []);
    this.options || this.loadAvailableOptions();
  }

  allDimensions() {
    var dim, dimType, dims, _i, _j, _len, _len1, _ref, _ref1;
    dims = [];
    _ref = ['row', 'column'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dimType = _ref[_i];
      _ref1 = this.report.dimensions[dimType];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        dim = _ref1[_j];
        dims.push(dim);
      }
    }
    return dims;
  }

  setDatatableOption(key, val) {
    var datatableOptions;
    datatableOptions = new PersistedOptions();
    return datatableOptions.setOption(key, val);
  }

  getDatatableOption(key) {
    var datatableOptions;
    datatableOptions = new PersistedOptions();
    return datatableOptions.getOption(key);
  }

  loadAvailableOptions() {
    return (this.options = ReportOptionsService.availableOptions(this));
  }

  /**
   * applyDefaultOrder resets the OrderRules to the report's default order and then applies the order transformers.
   */
  applyDefaultOrder() {
    var orderRule, orderRules, _i, _len, _ref;
    orderRules = [];
    _ref = this.report.defaultOrder;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      orderRule = _ref[_i];
      orderRules.push(new OrderRule(orderRule));
    }
    this.order = orderRules;
    if (this.canIncludeProducts && this.includeProducts) {
      this.applyProductOrderRule();
    }
    if (
      this.options['groupVariants'] &&
      this.options['groupVariants'].value === false
    ) {
      return this.applyGroupVariantsOrderRule();
    }
  }

  /**
   * Appends a new OrderRule for the product dimension, if products can be and are included.
   */
  applyProductOrderRule() {
    return this.order.push(
      new OrderRule({
        dimension: 'product',
        alphabetical: false,
        metric: this.defaultOrderOnMetric(),
        direction: 'desc'
      })
    );
  }

  /**
   * Updates any OrderRules that use the product dimension to use the variant form of the product dimension
   */
  applyGroupVariantsOrderRule() {
    var i, orderRule, _i, _len, _ref, _results;
    _ref = this.order;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      orderRule = _ref[i];
      if (orderRule.dimension === 'product') {
        this.order[i].dimension = 'productVariant';
      }
      if (orderRule.dimension === 'inventoryProduct') {
        _results.push((this.order[i].dimension = 'inventoryProductVariant'));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }

  /**
   * Loops through row aggregates until it finds the first sortable aggregate
   */
  defaultOrderOnMetric(report) {
    var aggregate, _i, _len, _ref, _ref1;
    if (report == null) {
      report = this.report;
    }
    _ref = report.aggregates.row;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      aggregate = _ref[_i];
      if ((_ref1 = aggregate.sortable) != null ? _ref1[report.type] : void 0) {
        return aggregate.key;
      }
    }
  }

  queryDefinition(size, from) {
    this.transformedReport = _.cloneDeep(this.report);
    this.transform();
    return new QueryDefinition(
      this.transformedReport,
      this.granularityDateSelection,
      this.order,
      from,
      size,
      this.filters
    );
  }

  identifier() {
    var dimension, str;
    str = 'rombo-';
    if (this.metric) {
      str += this.metric.key;
    }
    dimension = this.report.dimensions.row[
      this.report.dimensions.row.length - 1
    ];
    if (dimension === DimensionDefinitionsService.findByKey('summary')) {
      str += '-sales_summary';
    } else {
      str += '-for-';
      str += dimension.key;
    }
    str += '-by-';
    str += this.granularityDateSelection.granularity.key;
    return str;
  }

  transformers() {
    return [
      this.includeProductsTransformer,
      this.includeSelectedMetricTransformer,
      this.constrainInactiveInventory,
      this.groupVariantsTransformer,
      this.includeGiftCardsTransformer,
      this.includeOptionalAggregatesTransformer,
      this.excludeInvalidAggregatesTransformer,
      this.orderValidityTransformer,
      this.includeMetadataTransformer
    ];
  }

  transform() {
    var transformer, _i, _len, _ref, _results;
    _ref = this.transformers();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      transformer = _ref[_i];
      _results.push(transformer());
    }
    return _results;
  }

  /**
   * Adds a product dimension it to the row dimensions if it should be included
   */
  includeProductsTransformer() {
    var productDimension;
    productDimension = DimensionDefinitionsService.findByKey('product');
    if (
      _.indexOf(this.report.dimensions.rowOptional, productDimension) >= 0 &&
      this.includeProducts
    ) {
      return this.transformedReport.dimensions.row.push(productDimension);
    }
  }

  includeSelectedMetricTransformer() {
    if (!this.metric) {
      return;
    }
    return _.forEach(this.transformedReport.aggregates, (aggs, aggType) => {
      this.transformedReport.aggregates[aggType] = _.reject(aggs, {
        key: this.metric.key
      });
      if (aggType !== 'optional') {
        return this.transformedReport.aggregates[aggType].unshift(this.metric);
      }
    });
  }

  /**
   * Include a filter for only active inventory when constraintInactiveInventory is true
   */
  constrainInactiveInventory() {
    var _base, _ref, _ref1;
    if (
      ((_ref = this.options) != null
        ? (_ref1 = _ref['showInactiveProducts']) != null
          ? _ref1.value
          : void 0
        : void 0) === false
    ) {
      (_base = this.transformedReport).filters || (_base.filters = []);
      return this.transformedReport.filters.push({
        id: 'true',
        type: 'active_inventory'
      });
    }
  }

  /**
   * Replaces the product key with product_variants if groupVariants is false
   */
  groupVariantsTransformer() {
    var i, _ref, _ref1;
    if (
      ((_ref = this.options) != null
        ? (_ref1 = _ref['groupVariants']) != null
          ? _ref1.value
          : void 0
        : void 0) === false
    ) {
      i = this.transformedReport.dimensions.row
        .map(function(row) {
          return row.key;
        })
        .indexOf(DimensionDefinitionsService.findByKey('product').key);
      if (i !== -1) {
        this.transformedReport.dimensions.row[
          i
        ] = DimensionDefinitionsService.findByKey('productVariant');
      }
      i = this.transformedReport.dimensions.row
        .map(function(row) {
          return row.key;
        })
        .indexOf(DimensionDefinitionsService.findByKey('inventoryProduct').key);
      if (i !== -1) {
        this.transformedReport.dimensions.row[
          i
        ] = DimensionDefinitionsService.findByKey('inventoryProductVariant');
      }
    }
    return null;
  }

  /**
   * Adds a filter to exclude gift cards unless includeGiftCards is set to true
   */
  includeGiftCardsTransformer() {
    var _base, _ref;
    if (
      !this.options['includeGiftCards'] ||
      ((_ref = this.options['includeGiftCards']) != null ? _ref.value : void 0)
    ) {
      return;
    }
    (_base = this.transformedReport).filters || (_base.filters = []);
    return this.transformedReport.filters.push({
      id: 'true',
      type: 'exclude_gift_cards'
    });
  }

  /**
   * If optional aggregates have been added to the report, append them to the aggregates on the transformed report
   */
  includeOptionalAggregatesTransformer() {
    var newAggs;
    if (this.optionalAggregates) {
      newAggs = _.filter(this.transformedReport.aggregates.optional, agg => {
        return _.indexOf(this.optionalAggregates, agg.key) >= 0;
      });
      this.transformedReport.aggregates.row = _.union(
        this.transformedReport.aggregates.row,
        newAggs
      );
    }
  }

  excludeInvalidAggregatesTransformer() {
    if (this.granularityDateSelection.periodType !== 'all') {
      return _.forEach(this.transformedReport.aggregates, (aggs, aggType) => {
        return (this.transformedReport.aggregates[aggType] = _.reject(aggs, {
          config: {
            excludeOnDateRange: true
          }
        }));
      });
    }
  }

  /**
   * Checks there is a complete set of orderRules for transformed report definition. If there is not a complete set,
   * or there is a missmatch between the orderRule dimensions and the row dimensions, we reset the order to the default order
   */
  orderValidityTransformer() {
    var orderDimensionKeySet,
      orderMetricKey,
      orderMetricKeySet,
      rowAggregateKeySet,
      rowDimensionKey,
      rowDimensionKeySet,
      _i,
      _j,
      _len,
      _len1,
      _results;
    if (this.order.length === this.transformedReport.dimensions.row.length) {
      rowDimensionKeySet = DimensionDefinitionsService.keySet(
        this.transformedReport.dimensions.row
      );
      orderDimensionKeySet = _.map(this.order, 'dimension');
      for (_i = 0, _len = rowDimensionKeySet.length; _i < _len; _i++) {
        rowDimensionKey = rowDimensionKeySet[_i];
        if (_.indexOf(orderDimensionKeySet, rowDimensionKey) === -1) {
          this.applyDefaultOrder();
        }
      }
      orderMetricKeySet = _.map(this.order, 'metric');
      rowAggregateKeySet = _.map(this.transformedReport.aggregates.row, 'key');
      _results = [];
      for (_j = 0, _len1 = orderMetricKeySet.length; _j < _len1; _j++) {
        orderMetricKey = orderMetricKeySet[_j];
        if (
          !!orderMetricKey &&
          _.indexOf(rowAggregateKeySet, orderMetricKey) === -1
        ) {
          _results.push(this.applyDefaultOrder());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      return this.applyDefaultOrder();
    }
  }

  /**
   * Add metadata to the dimensions if metadata has been optionally added to the report, or if the report requires certain metadata.
   */
  includeMetadataTransformer() {
    var requiredMetadata, requiredMetadataKeys;
    requiredMetadata = MetadataDefinitionsService.requiredForReport(
      this.transformedReport
    );
    if (requiredMetadata) {
      requiredMetadataKeys = _.map(requiredMetadata, function(metadata) {
        return metadata.key;
      });
    }
    if (this.dimensionMetadata || requiredMetadataKeys) {
      return _.forEach(this.transformedReport.dimensions.row, dimensionRow => {
        var rowMetadata;
        rowMetadata = [];
        _.forEach(this.dimensionMetadata, function(dim) {
          var key1, key2, _ref;
          key1 = dimensionRow.key
            .replace('Variant', '')
            .replace('inventory', '');
          key2 = dim.dimension.replace('Variant', '').replace('inventory', '');
          if (key1 === key2) {
            if ((_ref = dim.metadata) != null ? _ref.length : void 0) {
              return (rowMetadata = dim.metadata);
            }
          }
        });
        dimensionRow.metadata = rowMetadata;
        if (requiredMetadataKeys) {
          return _.merge(dimensionRow.metadata, requiredMetadataKeys);
        }
      });
    }
  }
}
