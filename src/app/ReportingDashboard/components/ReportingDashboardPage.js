import React, { Component } from 'react';
import moment from 'moment';
import STATES from '../../../constants/states';
import WindowDelegate from '../../../rombostrap/utils/windowDelegate';
import UserConfig from '../../../modules/reporting/factories/user-config';
import ReportData from '../../../modules/reporting/factories/report-data';
import rbReportingConfigService from '../../../modules/reporting/config.service';
import PermissionService from '../../../modules/reporting/permission.service';
import GranularityDefinitionsService from '../../../modules/reporting/granularity-definitions.service';
import DashboardDefinitionsService from '../../../modules/reporting/dashboard-definitions.service';
import DimensionDefinitionsService from '../../../modules/reporting/dimension-definitions.service';
import ReportDatatable from '../../../modules/reporting/factories/report-datatable';
import AggregateDefinitionsService from '../../../modules/reporting/aggregate-definitions.service';
import GranularityDateSelection from '../../../modules/reporting/factories/granularity-date-selection';
import GranularityDateShifter from './GranularityDateShifter';
import GranularitySelector from './GranularitySelector';
import Report from './Report';
import Datatable from '../../common/components/DataTable';

const REFRESH_TIMEOUT = 120000;
const REFRESH_ENABLED = true;
const LIST_PAGE_SIZE = 10;
const PRODUCT_DATATABLE_CONFIG = {
  showMetadataFilters: false,
  showColumnHeaders: false,
  showMetricAggregates: false,
  showMetricSummary: false,
  showMetrics: false,
  loadMoreText: 'View Full Report',
  sparklineOptions: {
    show: true,
    cellAggregate: 'total_revenue'
  },
  formatterOptions: {
    currency: {
      decimalPlaces: 2
    }
  }
};
const USER_DATATABLE_CONFIG = {
  showColumnHeaders: false,
  showMetricAggregates: false,
  showMetricSummary: false,
  showMetrics: false,
  loadMoreText: 'View Full Report',
  formatterOptions: {
    currency: {
      decimalPlaces: 2
    }
  }
};

class ReportingDashboardPage extends Component {
  state = {
    state: STATES.inProgress,
    refreshEnabled: REFRESH_ENABLED
  };

  componentWillMount() {
    if (!PermissionService.canViewDashboard()) {
      this.props.history.replace('/reporting/summary');
      return;
    }
    const windowDelegate = WindowDelegate.getInstance();
    this.liveUpdate = {
      timeout: null,
      timeoutQueued: false
    };
    this.documentVisibility = true;
    this.onVisibleDocument = this.onVisibleDocument.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.init = this.init.bind(this);
    windowDelegate.on(
      windowDelegate.EVENTS().visibilityChange,
      this.onVisibleDocument
    );
    rbReportingConfigService.init().then(this.init);
  }

  componentWillUnmount() {
    const windowDelegate = WindowDelegate.getInstance();
    windowDelegate.off(
      windowDelegate.EVENTS().visibilityChange,
      this.onVisibleDocument
    );
    clearTimeout(this.liveUpdate.timeout);
  }

  onVisibleDocument(data) {
    this.documentVisibility = !data.hidden;
    if (!data.hidden && !this.liveUpdate.timeoutQueued) {
      this.refreshData();
    }
  }

  init() {
    this.granularityDateSelection = new GranularityDateSelection({
      selectedDate: new Date(),
      granularity: GranularityDefinitionsService.findByKey('day'),
      periodType: 'current_granularity',
      restrictFutureEndDate: 'day'
    });
    this.userConfig = new UserConfig();
    this.widgets = this.userConfig.widgets;
    this.productDefinition = this.productsReport();
    this.userDefinition = this.usersReport();
    this.productDatatableConfig = PRODUCT_DATATABLE_CONFIG;
    this.productDatatableConfig.loadMore = function() {};
    this.userDatatableConfig = USER_DATATABLE_CONFIG;
    this.userDatatableConfig.loadMore = function() {};
    this.updateByPeriodChange();
    this.setState({
      state: STATES.ready,
      refreshEnabled: PermissionService.canAccessDashboard()
    });
  }

  _selectedDateIsToday() {
    return (
      moment().diff(this.granularityDateSelection.getSelectedDate(), 'days') ===
      0
    );
  }

  _refreshIsEnabled() {
    return this.state.refreshEnabled && this._selectedDateIsToday();
  }

  productsReport() {
    return DashboardDefinitionsService.products(this.granularityDateSelection);
  }

  usersReport() {
    return DashboardDefinitionsService.users(this.granularityDateSelection);
  }

  outletsReport() {
    return DashboardDefinitionsService.outlets(this.granularityDateSelection);
  }

  refreshData() {
    if (!this.documentVisibility) {
      this.liveUpdate.timeoutQueued = false;
      return;
    }
    this.updateData();
    this.productViewUpdateData();
    this.userViewUpdateData();
  }

  resetRefreshTimeout() {
    clearTimeout(this.liveUpdate.timeout);
    if (this._refreshIsEnabled() && this.documentVisibility) {
      this.liveUpdate.timeout = setTimeout(this.refreshData, REFRESH_TIMEOUT);
      return (this.liveUpdate.timeoutQueued = true);
    } else {
      return (this.liveUpdate.timeoutQueued = false);
    }
  }

  updateByPeriodChange() {
    this.period = this.granularityDateSelection.update({ periodCount: 8 });
    this.refreshData();
  }

  updateData() {
    var aggregate, data, i, widget, _i, _len, _ref;
    data = ReportData.get(this.outletsReport().queryDefinition(), true);
    this.views = [];
    _ref = this.widgets;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      widget = _ref[i];
      aggregate = AggregateDefinitionsService.findByKey(widget.aggregate);
      if (!aggregate) {
        continue;
      }
      this.views[i] = data.view(widget.name, aggregate);
      this.views[i].widget = widget;
      this.views[i].granularity = this.granularityDateSelection.granularity.key;
    }
    return data.then(() => {
      this.setState({ state: STATES.ready });
      return this.resetRefreshTimeout();
    });
  }

  dateSelectionLastPeriod() {
    return new GranularityDateSelection({
      selectedDate: this.granularityDateSelection.getSelectedDate(),
      granularity: this.granularityDateSelection.granularity,
      periodType: 'current_granularity',
      periodCount: 1
    })
      .createPeriod()
      .localAsUTC();
  }

  productViewUpdateData() {
    var data, queryDef;
    this.productDefinition.report.dimensions.column = [
      DimensionDefinitionsService.findByKey(
        this.granularityDateSelection.granularity.key
      )
    ];
    queryDef = this.productDefinition.queryDefinition(LIST_PAGE_SIZE);
    queryDef.setOrderPeriod(this.dateSelectionLastPeriod());
    data = ReportData.get(queryDef, true);
    this.productDatatable = new ReportDatatable(data, true);
    data.then(() => {
      this.setState({ state: STATES.ready });
      data = this.filterLastDayResults(data);
      if (!data || data.table.rows.length === 0) {
        this.productDatatable.noResults = true;
        this.productDatatable.canLoadMore = false;
      }
      return this.resetRefreshTimeout();
    });
  }

  userViewUpdateData() {
    var data, queryDef;
    this.userDefinition.report.dimensions.column = [
      DimensionDefinitionsService.findByKey(
        this.granularityDateSelection.granularity.key
      )
    ];
    queryDef = this.userDefinition.queryDefinition(LIST_PAGE_SIZE);
    queryDef.setOrderPeriod(this.dateSelectionLastPeriod());
    data = ReportData.get(queryDef, true);
    this.userDatatable = new ReportDatatable(data, true);
    data.then(() => {
      this.setState({ state: STATES.ready });
      data = this.filterLastDayResults(data);
      if (!data || data.table.rows.length === 0) {
        this.userDatatable.noResults = true;
        this.userDatatable.canLoadMore = false;
      }
      return this.resetRefreshTimeout();
    });
  }

  /**
   * FilterLastDayResults filters a datatable to only include rows where there is a positive item_count in the last day.
   * Filtering will update the rows, row headers, row aggregates. The row aggregates are also updated to use the last day's sales
   */
  filterLastDayResults(data) {
    var filteredRowAggregates,
      filteredRowHeaders,
      filteredRowIds,
      filteredRows,
      i,
      lastDay,
      row,
      rowHeader,
      rowId,
      _i,
      _len,
      _ref;
    if (!data.table) {
      return;
    }
    lastDay = data.table.headers.columns.length - 1;
    filteredRowHeaders = [];
    filteredRows = [];
    filteredRowIds = [];
    filteredRowAggregates = [];
    _ref = data.table.rows;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      row = _ref[i];
      rowHeader = data.table.headers.rows[i];
      rowId = data.table.headers.rowIds[i];
      if (row[lastDay][0]['itemCount'] > 0) {
        filteredRowHeaders.push(rowHeader);
        filteredRowIds.push(rowId);
        filteredRows.push(row);
        filteredRowAggregates.push(row[lastDay]);
      }
    }
    data.table.rows = filteredRows;
    data.table.headers.rows = filteredRowHeaders;
    data.table.headers.rowIds = filteredRowIds;
    data.table.aggregates.row = filteredRowAggregates;
    return data;
  }

  handlePrev = e => {
    e.preventDefault();
    this.granularityDateSelection.shiftSelectedDate(-1);
    this.updateByPeriodChange();
  };

  handleNext = e => {
    e.preventDefault();
    if (!this.granularityDateSelection.canShiftSelectedDateUp()) return;
    this.granularityDateSelection.shiftSelectedDate(1);
    this.updateByPeriodChange();
  };

  handleGranularityChange = data => {
    this.granularityDateSelection.update(data);
    this.refreshData();
  };

  render() {
    const { state } = this.state;
    return state === STATES.inProgress ? (
      <div>Loading...</div>
    ) : state === STATES.ready ? (
      <div className="analytics">
        <section className="dashboard-date-content">
          <div className="dashboard-row">
            <div className="dashboard-heading">
              <h1>Retail Dashboard</h1>
            </div>
            <div className="dashboard-actions">
              <GranularitySelector
                granularityDateSelection={this.granularityDateSelection}
                onGranularitySelect={this.handleGranularityChange}
              />
              <GranularityDateShifter
                granularityDateSelection={this.granularityDateSelection}
                onPrev={this.handlePrev}
                onNext={this.handleNext}
              />
            </div>
          </div>
        </section>
        <section className="dashboard-primary-content">
          <div className="dashboard-row dashboard-row--widgets">
            {this.views.map((view, i) => (
              <div key={i} className="large-3 medium-4 columns">
                <Report type="chart" view={view} period={this.period} />
              </div>
            ))}
          </div>
        </section>
        <section className="dashboard-secondary-content">
          <div className="dashboard-row">
            <div className="large-12 columns">
              <h2>Products Sold</h2>
              {!this.productDatatable.loading && (
                <Datatable
                  config={this.productDatatableConfig}
                  definition={this.productDefinition}
                  reportDatatable={this.productDatatable}
                />
              )}
            </div>
          </div>
        </section>
        <section className="dashboard-secondary-content vd-mbxl">
          <div className="dashboard-row">
            <div className="large-12 columns">
              <h2>Top sales people</h2>
              {!this.userDatatable.loading && (
                <Datatable
                  config={this.userDatatableConfig}
                  definition={this.userDefinition}
                  reportDatatable={this.userDatatable}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    ) : (
      <div />
    );
  }
}

export default ReportingDashboardPage;
