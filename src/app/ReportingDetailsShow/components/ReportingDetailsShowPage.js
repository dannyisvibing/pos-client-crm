import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import STATES from '../../../constants/states';
import rbReportingConfigService from '../../../modules/reporting/config.service';
import ReportRouteService from '../../../modules/reporting/report-route.service';
import ReportData from '../../../modules/reporting/factories/report-data';
import ReportDatatable from '../../../modules/reporting/factories/report-datatable';
import datatableExport from '../../../modules/reporting/factories/datatable-export';
import ReportDefinitionService from '../../../modules/reporting/report-definitions.service';
import AggregateDefinitionService from '../../../modules/reporting/aggregate-definitions.service';
import FilterDefinitionService from '../../../modules/reporting/filter-definitions.service';
import DimensionDefinitionService from '../../../modules/reporting/dimension-definitions.service';
import GranularityDateSelection from '../../../modules/reporting/factories/granularity-date-selection';
import Datatable from '../../common/components/DataTable';
import ReportControls from './ReportControls';
import ReportFilter from './ReportFilter';
import ReportContentLayout, {
  ReportControls as ReportControlsLayout,
  DataTable as DataTableLayout,
  ReportFilter as ReportFilterLayout
} from './Layout';

const pageSize = 100;
const REPORT_REQUEST_TIMEOUT = 200;
const DEFAULT_CONFIG = {
  formatterOptions: {
    currency: {
      decimalPlaces: 2
    },
    whole_number: {
      decimalPlaces: 0,
      round: true
    },
    number: {
      decimalPlaces: 1
    }
  }
};

class ReportingDetailsShowPage extends Component {
  state = {
    state: STATES.inProgress,
    showDatatableFilter: false,
    config: DEFAULT_CONFIG
  };

  componentWillMount() {
    this._init = this._init.bind(this);
    this.onReportDatatableUpdate = this.onReportDatatableUpdate.bind(this);
    this.timeOfLastReport = null;
    this.reportingConfigDone = false;
    rbReportingConfigService.init().then(() => {
      this.reportingConfigDone = true;
      this.reports = ReportDefinitionService.all();
      this.init();
    });
  }

  componentDidUpdate() {
    if (!this.reportingConfigDone) return;
    if (this.fullUrl === window.location.href) return;
    this.init();
  }

  componentWillUnmount() {
    this.reportDatatable.off(this.onReportDatatableUpdate);
  }

  init() {
    this.fullUrl = window.location.href;
    this.setState({ state: STATES.inProgress }, this._init);
  }

  _init() {
    const { location, match } = this.props;
    this.datatableDefinition = ReportRouteService.fromRouteParams({
      location,
      match
    });
    if (!ReportRouteService.hasReportDefinition({ location, match })) {
      this.reportDidChange();
      this.setReportDefaultDefinition();
      this.updateUrl();
    } else {
      this.reportDidChange();
      this.updateReportDatatable();
    }
  }

  reportType() {
    switch (this.selectedReport.type) {
      case 'payment':
        return 'Payments Report';
      case 'inventory':
        return 'Inventory Report';
      case 'tax':
        return 'Tax Report';
      default:
        return 'Sales Report';
    }
  }

  reportDidChange() {
    this.selectedReport = this.datatableDefinition.report;
    this.selectedMetric = this.datatableDefinition.metric;
    this.includeProducts = this.datatableDefinition.includeProducts;
    this.resetAggregates();
    this.updateGranularityDateSelection();
    this.resetFilters();
    this.resetCanIncludeProducts();
    this.updateAvailableReportOptions();
  }

  setReportDefaultDefinition() {
    this.datatableDefinition.applyDefaultOrder();
  }

  getReportDataPromise() {
    var columnDimension, def;
    def = this.datatableDefinition.queryDefinition(pageSize, this.currentSize);
    columnDimension = DimensionDefinitionService.findByKey(
      this.datatableDefinition.granularityDateSelection.granularity.key
    );
    if (columnDimension && this.datatableDefinition.report.hasDateFilter()) {
      def.addDimension('column', columnDimension);
    }
    this.timeOfLastReport = new Date().getTime();
    return ReportData.get(def);
  }

  updateReportDatatable() {
    var data, timeSince;
    timeSince = new Date().getTime() - this.timeOfLastReport;
    if (timeSince < REPORT_REQUEST_TIMEOUT && this.timeOfLastReport !== null) {
      return;
    }
    this.currentSize = 0;
    data = this.getReportDataPromise();
    this.reportDatatable = new ReportDatatable(data, true);
    this.reportDatatable.on('update', this.onReportDatatableUpdate);
  }

  onReportDatatableUpdate() {
    this.setState({
      state: STATES.ready,
      showDatatableFilter:
        this.datatableDefinition.filters &&
        this.datatableDefinition.filters.length > 0
    });
  }

  resetAggregates() {
    var report;
    report = this.selectedReport;
    this.metrics = AggregateDefinitionService.forReport(report);
    if (
      !_.find(this.metrics, m => {
        var _ref;
        return (
          m.key === ((_ref = this.selectedMetric) != null ? _ref.key : void 0)
        );
      })
    ) {
      this.datatableDefinition.metric = _.find(this.metrics, function(m) {
        return m['default'];
      });
    }
  }

  resetFilters() {
    var filter, lookup, _i, _len, _ref;
    this.availableFilters = FilterDefinitionService.limit(this.selectedReport);
    lookup = {};
    _ref = this.availableFilters;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      filter = _ref[_i];
      lookup[filter.key] = true;
    }
    this.datatableDefinition.filters = _.remove(
      this.datatableDefinition.filters,
      function(filter) {
        return lookup[filter.type];
      }
    );
  }

  resetCanIncludeProducts() {
    var optionalDimensions, optionalDimensionsKeySet;
    optionalDimensions =
      this.datatableDefinition.report.dimensions.rowOptional || [];
    optionalDimensionsKeySet = DimensionDefinitionService.keySet(
      optionalDimensions
    );
    this.datatableDefinition.canIncludeProducts =
      _.indexOf(optionalDimensionsKeySet, 'product') >= 0;
  }

  updateAvailableReportOptions() {
    this.datatableDefinition.loadAvailableOptions();
  }

  updateGranularityDateSelection() {
    var config, datatable, minDate, periodType, startDate, _ref;
    if (!this.selectedReport.hasDateFilter()) {
      return;
    }
    config = this.selectedReport.config.datePicker;
    datatable = this.datatableDefinition;
    if (
      (_ref = datatable.granularityDateSelection.granularity.key) === 'all' ||
      _ref === 'range' ||
      _ref === 'single'
    ) {
      periodType = datatable.granularityDateSelection.granularity.key;
    } else {
      periodType = 'compare';
    }
    if (!config[periodType]) {
      if (config.all) {
        datatable.granularityDateSelection = GranularityDateSelection.getAllSelection();
      } else if (config.compare) {
        datatable.granularityDateSelection = GranularityDateSelection.getCompareSelection();
      } else if (config.single) {
        datatable.granularityDateSelection = GranularityDateSelection.getSingleSelection();
      } else {
        if (config.startMonth) {
          startDate = moment().startOf('month');
        }
        if (config.minDate) {
          minDate = moment(config.minDate).toDate();
        }
        datatable.granularityDateSelection = GranularityDateSelection.getRangeSelection(
          startDate,
          minDate
        );
      }
    }
  }

  handleReportUpdate = report => {
    this.datatableDefinition.report = report;
    this.datatableDefinition.applyDefaultOrder();
    this.updateUrl();
  };

  handleMetricUpdate = metric => {
    this.datatableDefinition.metric = metric;
    this.updateUrl();
  };

  handleIncludeProductsUpdate = include => {
    this.datatableDefinition.includeProducts = include;
    this.updateAvailableReportOptions();
    this.datatableDefinition.applyDefaultOrder();
    this.updateUrl();
  };

  handleDateSelectionUpdate = dateSelection => {
    this.datatableDefinition.granularityDateSelection.update(dateSelection);
    this.updateUrl();
  };

  handleShowDatatableFilter = e => {
    e.preventDefault();
    const { showDatatableFilter } = this.state;
    if (showDatatableFilter && this.datatableDefinition.filters.length > 0) {
      this.datatableDefinition.filters = [];
      this.updateUrl();
    } else {
      this.setState({ showDatatableFilter: !this.state.showDatatableFilter });
    }
  };

  handleMetadataUpdate = rowMetadata => {
    this.datatableDefinition.dimensionMetadata = rowMetadata;
    this.updateUrl();
  };

  handleOptionalAggsUpdate = optionalAggregates => {
    this.datatableDefinition.optionalAggregates = optionalAggregates;
    this.updateUrl();
  };

  handleOrderUpdate = () => {
    this.updateUrl();
  };

  handleFilterUpdate = filters => {
    this.datatableDefinition.filters = filters;
    this.updateUrl();
  };

  updateUrl() {
    ReportRouteService.update(this.props.history, this.datatableDefinition);
  }

  handleExport = e => {
    e.preventDefault();
    datatableExport(this.datatableDefinition);
  };

  render() {
    const { state, showDatatableFilter } = this.state;
    return state === STATES.inProgress ? (
      <div>Loading...</div>
    ) : state === STATES.ready ? (
      <ReportContentLayout label={this.reportType()}>
        <ReportControlsLayout>
          <ReportControls
            reports={this.reports}
            metrics={this.metrics}
            granularityDateSelection={
              this.datatableDefinition.granularityDateSelection
            }
            canIncludeProducts={this.datatableDefinition.canIncludeProducts}
            selectedReport={this.selectedReport}
            selectedMetric={this.selectedMetric}
            includeProducts={this.includeProducts}
            showDatatableFilter={showDatatableFilter}
            onUpdateReport={this.handleReportUpdate}
            onUpdateMetric={this.handleMetricUpdate}
            onUpdateIncludeProducts={this.handleIncludeProductsUpdate}
            onUpdateDateSelection={this.handleDateSelectionUpdate}
            onShowFilter={this.handleShowDatatableFilter}
            onExport={this.handleExport}
          />
        </ReportControlsLayout>
        {showDatatableFilter && (
          <ReportFilterLayout>
            <ReportFilter
              filterTypes={this.availableFilters}
              selectedFilters={this.datatableDefinition.filters}
              onFilterUpdate={this.handleFilterUpdate}
            />
          </ReportFilterLayout>
        )}
        <DataTableLayout>
          <Datatable
            reportDatatable={this.reportDatatable}
            definition={this.datatableDefinition}
            config={this.state.config}
            onMetadataUpdate={this.handleMetadataUpdate}
            onOptionalAggsUpdate={this.handleOptionalAggsUpdate}
            onOrderUpdate={this.handleOrderUpdate}
          />
        </DataTableLayout>
      </ReportContentLayout>
    ) : (
      <div />
    );
  }
}

export default ReportingDetailsShowPage;
