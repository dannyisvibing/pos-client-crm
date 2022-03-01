import _ from 'lodash';
import AggregateDefinitionsService from './aggregate-definitions.service';
import ReportDefinitionsService from './report-definitions.service';
import DimensionDefinitionsService from './dimension-definitions.service';
import DatatableDefinition from './factories/datatable-definition';

export default class DashboardDefinitionsService {
  static getMetrics() {
    var outletMetrics = _.compact([
      AggregateDefinitionsService.findByKey('totalRevenue'),
      AggregateDefinitionsService.findByKey('itemCount'),
      AggregateDefinitionsService.findByKey('saleCount'),
      AggregateDefinitionsService.findByKey('customerCount'),
      AggregateDefinitionsService.findByKey('grossProfit'),
      AggregateDefinitionsService.findByKey('totalCost'),
      AggregateDefinitionsService.findByKey('basketValue'),
      AggregateDefinitionsService.findByKey('basketSize'),
      AggregateDefinitionsService.findByKey('totalDiscount'),
      AggregateDefinitionsService.findByKey('discountPercent')
    ]);

    var userMetrics = _.compact([
      AggregateDefinitionsService.findByKey('saleCount'),
      AggregateDefinitionsService.findByKey('itemCount'),
      AggregateDefinitionsService.findByKey('totalRevenue'),
      AggregateDefinitionsService.findByKey('saleCount'),
      AggregateDefinitionsService.findByKey('basketValue'),
      AggregateDefinitionsService.findByKey('basketSize')
    ]);

    return { outletMetrics, userMetrics };
  }

  static outlets(granularityDateSelection) {
    var metrics = this.getMetrics();
    var datatableSorting, report;
    report = _.cloneDeep(ReportDefinitionsService.findByKey('outlet'));
    report.dimensions.column.push(
      DimensionDefinitionsService.findByKey(
        granularityDateSelection.granularity.key
      )
    );
    report.aggregates = {
      cell: metrics.outletMetrics,
      column: metrics.outletMetrics,
      row: metrics.outletMetrics,
      table: []
    };
    datatableSorting = [
      {
        direction: 'desc',
        metric: 'totalRevenue',
        dimension: report.dimensions.row[0].name
      }
    ];
    return new DatatableDefinition({
      report: report,
      granularityDateSelection: granularityDateSelection,
      order: datatableSorting
    });
  }

  static products(granularityDateSelection) {
    var report;
    report = _.cloneDeep(ReportDefinitionsService.findByKey('product'));
    report.aggregates = {
      cell: [
        AggregateDefinitionsService.findByKey('totalRevenue'),
        AggregateDefinitionsService.findByKey('itemCount'),
        AggregateDefinitionsService.findByKey('totalTax'),
        AggregateDefinitionsService.findByKey('totalDiscount'),
        AggregateDefinitionsService.findByKey('discountPercent')
      ],
      row: _.compact([
        AggregateDefinitionsService.findByKey('itemCount'),
        AggregateDefinitionsService.findByKey('totalDiscount'),
        AggregateDefinitionsService.findByKey('totalRevenue')
      ]),
      column: [],
      table: []
    };
    report.defaultOrder = [
      {
        dimension: 'product',
        metric: 'totalRevenue',
        direction: 'desc'
      }
    ];
    return new DatatableDefinition({
      report: report,
      granularityDateSelection: granularityDateSelection,
      filters: [],
      metric: AggregateDefinitionsService.findByKey('totalRevenue')
    });
  }
  static users(granularityDateSelection) {
    var metrics = this.getMetrics();
    var report;
    report = _.cloneDeep(ReportDefinitionsService.findByKey('user'));
    report.aggregates = {
      cell: metrics.userMetrics,
      row: metrics.userMetrics,
      column: [],
      table: []
    };
    report.defaultOrder = [
      {
        dimension: 'user',
        metric: 'totalRevenue',
        direction: 'desc'
      }
    ];
    return new DatatableDefinition({
      report: report,
      granularityDateSelection: granularityDateSelection,
      filters: [],
      metric: AggregateDefinitionsService.findByKey('totalRevenue')
    });
  }
}
