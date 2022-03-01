import Formatters from '../../utils/formatters';
import ReportDefinition from './factories/report-definition';
import rbReportingResource from './reporting.resource';
import AggregateDefinitionsService from './aggregate-definitions.service';
import FilterDefinitionsService from './filter-definitions.service';
import DimensionDefinitionsService from './dimension-definitions.service';
import MetadataDefinitionsService from './metadta-definitions.service';
import ReportDefinitionsService from './report-definitions.service';

export default class ReportingConfigService {
  static init() {
    if (window.reportingConfigurationInitialized) {
      return new Promise(resolve => resolve());
    } else {
      return rbReportingResource.config().then(config => {
        return this._init(config);
      });
    }
  }

  static _init(config) {
    var _ref, _ref1, _ref2, _i, _j, _k, _len, _len1, _len2, agg, metadata, def;
    window.reportingConfigurationInitialized = true;
    window.maxReportDurationDays = config.maxReportDurationDays;

    _ref = config.aggregates;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      agg = _ref[_i];
      agg.formatter = Formatters.named(agg.formatter.name);
      AggregateDefinitionsService.addAggregate(agg);
    }
    FilterDefinitionsService.addFilters(config.filters);
    DimensionDefinitionsService.addDimensions(config.dimensions);
    _ref1 = config.metadata;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      metadata = _ref1[_j];
      metadata.formatter = Formatters.named(metadata.formatter.name);
      MetadataDefinitionsService.addMetadata(metadata);
    }
    _ref2 = config.definitions;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      def = _ref2[_k];
      ReportDefinitionsService.addReport(ReportDefinition.fromJSON(def));
    }
  }
}
