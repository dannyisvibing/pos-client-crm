import moment from 'moment';
import _ from 'lodash';
import queryString from 'query-string';

import FilterTag from './factories/filter-tag';
import GranularityDateSelection from './factories/granularity-date-selection';
import PersistedOptions from './factories/persisted-options';
import OrderRule from './factories/order-rule';
import DatatableDefinition from './factories/datatable-definition';

import ReportDefinitionsService from './report-definitions.service';
import GranularityDefinitionsService from './granularity-definitions.service';
import AggregateDefinitionsService from './aggregate-definitions.service';
import AdvancedReportingService from './advanced-reporting-service';

import DatetimeService from '../../utils/datetimeService';
import ReportOptionsService from './report-options.service';

export default class ReportRouteService {
  static update(router, datatableDefinition) {
    var datatableParams;
    datatableParams = this.toParams(datatableDefinition);
    router.push({
      pathname: `/reporting/${datatableDefinition.report.key}`,
      search: encodeURIComponent(
        `definition=${JSON.stringify(datatableParams)}`
      )
    });
  }

  static toParams(datatableDefinition) {
    var params, _ref;
    params = {
      metric: (_ref = datatableDefinition.metric) != null ? _ref.key : void 0,
      constraints: _.map(datatableDefinition.filters, function(filter) {
        return {
          id: filter.id,
          name: filter.name,
          type: filter.type
        };
      }),
      granularity: datatableDefinition.granularityDateSelection.granularity.key,
      periodType: datatableDefinition.granularityDateSelection.periodType,
      periodCount: datatableDefinition.granularityDateSelection.periodCount,
      order: datatableDefinition.order,
      includeProducts: datatableDefinition.includeProducts,
      options: ReportOptionsService.dehydrateOptions(
        datatableDefinition.options
      ),
      dimensionMetadata: datatableDefinition.dimensionMetadata,
      optionalAggregates: datatableDefinition.optionalAggregates
    };
    if (params.periodType !== 'all') {
      params.selectedDate = DatetimeService.slugify(
        datatableDefinition.granularityDateSelection.getSelectedDate()
      );
      params.startDate = DatetimeService.slugify(
        datatableDefinition.granularityDateSelection.getPeriodStartDate()
      );
      params.endDate = DatetimeService.slugify(
        datatableDefinition.granularityDateSelection.getPeriodEndDate()
      );
    }
    return params;
  }

  static hasReportDefinition(route) {
    const { location, match } = route;
    if (!location || !match) return false;
    var params = _.defaults(
      {},
      queryString.parse(decodeURIComponent(location.search)),
      match.params
    );
    return !!params.definition;
  }

  static fromRouteParams(route) {
    const { location, match } = route;
    var params = {};
    if (!location || !match) return;
    params = _.defaults(
      {},
      queryString.parse(decodeURIComponent(location.search)),
      match.params
    );

    var constraint,
      def,
      tags,
      tag,
      report,
      minDate,
      granularityDateSelection,
      datatableOptions,
      dimensionMetadata,
      optionalAggregates,
      _ref,
      _i,
      _j,
      _len,
      _len1,
      isAttemptToAccessAdvancedReport,
      metric,
      options,
      orderRules,
      rule,
      _ref1;
    if (params.definition == null) {
      def = {};
    } else {
      def = JSON.parse(params.definition);
      tags = [];
      if (def.constraints) {
        _ref = def.constraints;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          constraint = _ref[_i];
          tag = new FilterTag(constraint);
          tags.push(tag);
        }
      }
    }
    report = ReportDefinitionsService.findByKey(params.slug);
    minDate = report.config.datePicker.minDate;
    granularityDateSelection = new GranularityDateSelection({
      selectedDate: DatetimeService.parseKey(def.selectedDate),
      startDate: def.startDate,
      endDate: def.endDate,
      minDate: minDate ? moment(minDate).toDate() : void 0,
      granularity: GranularityDefinitionsService.findByKey(def.granularity),
      periodType: def.periodType,
      periodCount: _.parseInt(def.periodCount)
    });
    datatableOptions = new PersistedOptions();
    dimensionMetadata =
      def.dimensionMetadata || datatableOptions.getDatatableOption('metadata');
    optionalAggregates =
      def.optionalAggregates ||
      datatableOptions.getDatatableOption('optionalAggregates');
    isAttemptToAccessAdvancedReport = false;
    metric = AggregateDefinitionsService.findByKey(def.metric);
    if (def.options) {
      options = def.options;
      datatableOptions.setOption('reportOptions', def.options);
    } else {
      options = datatableOptions.getOption('reportOptions');
    }
    if (def.order != null) {
      orderRules = [];
      _ref1 = def.order;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        rule = _ref1[_j];
        orderRules.push(new OrderRule(rule));
      }
    }
    if (!AdvancedReportingService.isDefinitionAccessible(report)) {
      report = ReportDefinitionsService['default']();
      isAttemptToAccessAdvancedReport = true;
    }
    if (!AdvancedReportingService.isDefinitionAccessible(metric)) {
      metric = AggregateDefinitionsService['default']();
      isAttemptToAccessAdvancedReport = true;
    }
    if (isAttemptToAccessAdvancedReport) {
      // Message
    }
    def = new DatatableDefinition({
      dimensionMetadata: dimensionMetadata,
      optionalAggregates: optionalAggregates,
      filters: tags,
      granularityDateSelection: granularityDateSelection,
      includeProducts: def.includeProducts || false,
      metric: metric,
      order: orderRules,
      report: report,
      options: ReportOptionsService.hydrateOptions(options)
    });
    return def;
  }
}
