/* eslint-disable */
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';
import splitNumber from '../utils/splitNumber';
import escape from '../../../utils/escape';
import DatatableOrder from '../../../modules/reporting/factories/datatable-ordering';
import MetadataDefinitionsService from '../../../modules/reporting/metadta-definitions.service';
import AggregateDefinitionsService from '../../../modules/reporting/aggregate-definitions.service';
import DimensionUrlService from '../../../modules/reporting/dimension-url.service';
import MetadataDropdown from './MetadataDropdown';
import OptionalAggregateDropdown from './OptionalAggregateDropdown';
import '../styles/Datatable.css';

const configDefaults = {
  collapseRowHeaders: true,
  showMetadataFilters: true,
  showColumnHeaders: true,
  showMetrics: true,
  showAggregates: true,
  showMetricSummary: true,
  showMetricAggregates: true,
  showRows: true,
  showTotalsTop: false,
  loadMoreText: 'Load More',
  noResultsMessage: 'No data available for this period',
  sparklineOptions: {
    show: false
  },
  formatterOptions: {
    number: null,
    currency: null,
    percent: null
  }
};

function whichChild(elem) {
  var i = 0;
  while ((elem = elem.previousSibling) != null) ++i;
  return i;
}

function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

class DataTable extends Component {
  state = {
    config: null,
    renderedCount: 0
  };

  componentWillMount() {
    var orderClasses = {
      asc: 'datatable-order--asc',
      desc: 'datatable-order--desc'
    };
    var config;
    config = _.defaults(this.props.config, configDefaults);
    this.setState({ config });
    this.datatableOrder = new DatatableOrder(orderClasses);
    this.orderByDimension = this.datatableOrder.orderByDimension;
    this.orderBy = this.datatableOrder.orderByAggregate;
  }

  componentDidMount() {
    this.renderDatatable();
  }

  componentWillReceiveProps(nextProps) {
    var reportDatatable = nextProps.reportDatatable;
    if (
      reportDatatable == null ||
      reportDatatable.error ||
      reportDatatable.loading
    ) {
      return;
    }
    this.renderDatatable();
  }

  selectionsForDates(data) {
    var datum,
      displayHeader,
      ends,
      formattedHeader,
      headerFormat,
      headers,
      lastHeader,
      lastResult,
      result,
      selectedGranularity,
      showHeaders,
      starts,
      _i,
      _len,
      _ref;
    selectedGranularity = this.props.definition.granularityDateSelection
      .granularity;
    showHeaders = selectedGranularity.key !== 'year';
    headerFormat = selectedGranularity.reportHeaderFormat || 'YYYY';
    headers = [];
    starts = [];
    ends = [];
    lastHeader = null;
    lastResult = null;
    _ref = data || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      datum = _ref[_i];
      result = lastResult;
      formattedHeader = moment(parseInt(datum[0], 10))
        .utc()
        .format(headerFormat);
      if (formattedHeader !== lastHeader) {
        displayHeader = showHeaders ? formattedHeader : '';
        lastResult = result = {
          formattedHeader: displayHeader,
          length: 0
        };
        headers.push(result);
        starts.push(true);
        ends.push(true);
      } else {
        starts.push(false);
        ends.push(false);
      }
      result.length++;
      lastHeader = formattedHeader;
    }
    ends.push(true);
    ends.shift();
    return {
      headers: headers,
      starts: starts,
      ends: ends
    };
  }

  valueForLabel(data) {
    var granularity;
    granularity = this.props.definition.granularityDateSelection.granularity;
    return granularity.format({
      date: parseInt(data, 10)
    });
  }

  renderDatatable() {
    var target,
      datatable,
      definition,
      config,
      headers,
      aggregates,
      rowMetadata,
      rowMetadataKeys,
      dimensions,
      rows,
      metric,
      aggs,
      row_titles,
      tableClasses,
      metadataColLength,
      i,
      j,
      dimension,
      lastInRow,
      classes,
      directionClass,
      count,
      sections,
      header,
      column,
      headerColSpan,
      key,
      aggregate,
      headerClass,
      cell,
      formatterOptions,
      value,
      totalAggregateLookup,
      totalRowClass,
      lastRowIDs,
      row,
      lastRow,
      isStartOfGroupRow,
      rowIDs,
      label,
      rowLabel,
      rowUrl,
      valueType,
      metricFormatterOptions,
      aggRowClass,
      emptyColSpan,
      rowsClass;
    var _ref,
      _ref1,
      _ref2,
      _ref3,
      _ref4,
      _ref5,
      _ref6,
      _ref7,
      _ref8,
      _ref9,
      _ref10,
      _ref11,
      _i,
      _j,
      _k,
      _l,
      _m,
      _n,
      _o,
      _p,
      _q,
      _r,
      _t,
      _u,
      _len,
      _len1,
      _len2,
      _len3,
      _len4,
      _len5,
      _len6,
      _len7,
      _len8,
      _len9,
      _len11,
      _len12;
    var tableComp,
      metadataDropdownComp,
      headerComp,
      labelsComp,
      totalRowComp,
      headerLabelsComp,
      metadataComp,
      rowsComp,
      cellComp,
      aggsComp,
      colAggsComp,
      colAggsMetricsComp;
    target = document.getElementsByTagName('datatable')[0];
    datatable = this.props.reportDatatable;
    definition = this.props.definition;
    config = _.defaults({}, definition.report.config, this.state.config);
    console.log('datatable: ', datatable);
    headers = datatable.data.headers;
    aggregates = datatable.data.aggregates;
    rowMetadata = datatable.data.headers.rowMetadata;
    rowMetadataKeys = datatable.data.headers.rowMetadataKeys;
    dimensions = definition.transformedReport.dimensions;
    rows = datatable.data.rows;
    if (definition.metric) {
      metric = definition.metric.key;
    }
    this.metadataCollection = MetadataDefinitionsService.forReport(
      definition.transformedReport
    );
    this.showMetadataFilter =
      this.metadataCollection.length > 0 && config.showMetadataFilters;
    aggs = definition.transformedReport.aggregates;
    this.optionalAggregates = aggs.optional;
    this.showAggregateDropdown =
      (_ref = this.optionalAggregates) != null ? _ref.length : void 0;
    this.activeAggregates = _.union(
      aggs.row,
      aggs.cell,
      aggs.column,
      aggs.table
    );
    this.order = definition.order;
    if (datatable.noResults) {
      config.showMetricSummary = false;
      config.showMetricAggregates = false;
      config.showTotalsTop = false;
    }
    if (headers.columns.length === 0) {
      config.showMetricAggregates = false;
    }
    row_titles = _.map(dimensions.row, 'name');
    tableClasses = ['datatable'];
    if (!config.showColumnHeaders) {
      tableClasses.push('datatable--no-col-headers');
    }
    if (!config.showMetrics) {
      tableClasses.push('datatable--no-col-dimensions');
    }
    if (!config.showMetricSummary) {
      tableClasses.push('datatable--no-table-aggregates');
    }
    if (!config.showMetricAggregates) {
      tableClasses.push('datatable--no-col-aggregates');
    }
    if (datatable.canLoadMore) {
      tableClasses.push('datatable--can-load-more');
    }
    if (!config.showRows) {
      tableClasses.push('datatable--no-rows');
    }
    if (datatable.noResults) {
      tableClasses.push('datatable--has-no-results');
    }
    metadataDropdownComp = (
      <MetadataDropdown
        definition={definition}
        metadataItems={this.metadataCollection}
        onMetadataUpdate={this.props.onMetadataUpdate}
      />
    );
    metadataColLength = _.reduce(
      rowMetadataKeys,
      function(count, keySet) {
        count += keySet.length;
        return count;
      },
      0
    );
    headerComp = [];
    labelsComp = [];
    if (config.showColumnHeaders) {
      headerComp.push(
        <th
          key={headerComp.length}
          colSpan={row_titles.length + metadataColLength + 1}
        />
      );
    }
    _ref1 = dimensions.row;
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      dimension = _ref1[i];
      lastInRow = i === row_titles.length - 1;
      classes = ['datatable-row-label-label'];
      directionClass = this.datatableOrder.getDimensionHeaderClass(
        definition.order[0],
        dimension.key
      );
      if (directionClass !== '') {
        classes.push(directionClass);
      }
      if (lastInRow) {
        classes.push('datatable-row-label-label--last');
      }
      labelsComp.push(
        <th
          key={labelsComp.length}
          colSpan={i === 0 ? 2 : 1}
          className={classes.join(' ')}
        >
          {dimension.sortable ? (
            <a
              href=""
              onClick={e => {
                e.preventDefault();
                this.orderByDimension(this.order);
                this.props.onOrderUpdate();
              }}
            >
              {dimension.name}
            </a>
          ) : (
            dimension.name
          )}
          {metadataColLength === 0 &&
            this.showMetadataFilter &&
            lastInRow &&
            metadataDropdownComp}
        </th>
      );
    }
    count = 0;
    _.forEach(rowMetadataKeys, rowMetadataKeySet => {
      return _.forEach(rowMetadataKeySet, key => {
        var metadata;
        count++;
        metadata = MetadataDefinitionsService.findByKey(key);
        classes = ['datatable-row-label-label'];
        if (count === metadataColLength) {
          classes.push('datatable-row-label-label--last');
        }
        labelsComp.push(
          <th key={labelsComp.length} className={classes.join(' ')}>
            {count === metadataColLength &&
              this.showMetadataFilter &&
              metadataDropdownComp}
            {metadata.name}
          </th>
        );
      });
    });
    sections = this.selectionsForDates(headers.columns);
    if (config.showMetrics) {
      _ref2 = sections.headers;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        header = _ref2[_j];
        if (config.showColumnHeaders) {
          headerComp.push(
            <th key={headerComp.length} colSpan={header.length}>
              {header.formattedHeader}
            </th>
          );
        }
      }
      _ref3 = headers.columns;
      for (i = _k = 0, _len2 = _ref3.length; _k < _len2; i = ++_k) {
        column = _ref3[i];
        classes = ['datatable-col-label'];
        if (sections.starts[i]) {
          classes.push('datatable-cell--section-start');
        }
        if (sections.ends[i]) {
          classes.push('datatable-cell--section-end');
        }
        labelsComp.push(
          <th key={labelsComp.length} className={classes.join(' ')}>
            {this.valueForLabel(column[0])}
          </th>
        );
      }
    }
    if (config.showAggregates) {
      headerColSpan = aggregates.rowTitles.length;
      if (this.showAggregateDropdown) {
        headerColSpan += 1;
      }
      if (config.sparklineOptions.show) {
        headerColSpan += 1;
      }
      if (config.showColumnHeaders) {
        var pprHelpUrl = `https://support.rombo.com/hc/en-us/articles/Product-Performance-Report`;
        headerComp.push(
          <th
            key={headerComp.length}
            className="datatable-row-aggs-header"
            colSpan={headerColSpan}
          >
            Totals By {row_titles.join(', ')}
            {definition.transformedReport.isPPRReport() && (
              <a
                className="icon datatable-row-aggs-header-info"
                href={pprHelpUrl}
                target="_blank"
              >
                help
              </a>
            )}
          </th>
        );
      }
      _ref4 = aggregates.rowTitles;
      for (i = _l = 0, _len3 = _ref4.length; _l < _len3; i = ++_l) {
        key = _ref4[i];
        aggregate = AggregateDefinitionsService.findByKey(key);
        classes = ['datatable-row-aggs-label'];
        if (i === 0) {
          classes.push('datatable-row-aggs-label--start');
        }
        headerClass = this.datatableOrder.getAggregateHeaderClass(
          definition.order[0],
          key
        );
        if (headerClass !== '') {
          classes.push(headerClass);
        }
        let orderKey = key;
        labelsComp.push(
          <th key={labelsComp.length} className={classes.join(' ')}>
            {((_ref5 = aggregate.sortable) != null ? (
              _ref5[definition.report.type]
            ) : (
              void 0
            )) ? (
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  this.orderBy(this.order, orderKey);
                  this.props.onOrderUpdate();
                }}
              >
                {aggregate.name}
              </a>
            ) : (
              aggregate.name
            )}
          </th>
        );
      }
      if (config.sparklineOptions.show) {
        labelsComp.push(
          <th key={labelsComp.length} className="datatable-row-aggs-label">
            Trend
          </th>
        );
      }
    }
    if (this.showAggregateDropdown) {
      labelsComp.push(
        <th key={labelsComp.length} className="datatable-row-filter">
          <OptionalAggregateDropdown
            active={this.activeAggregates}
            definition={definition}
            optional={this.optionalAggregates}
            onAggregatesUpdate={this.props.onOptionalAggsUpdate}
          />
        </th>
      );
    }
    if (config.showMetricSummary) {
      totalRowComp = [];
      headers = datatable.data.headers;
      aggregates = datatable.data.aggregates;
      aggregate = AggregateDefinitionsService.findByKey(metric);
      totalRowComp.push(
        <th
          key={totalRowComp.length}
          colSpan={row_titles.length + metadataColLength + 1}
        >
          Totals
        </th>
      );
      if (config.showMetrics) {
        _ref6 = aggregates.column;
        for (i = _m = 0, _len4 = _ref6.length; _m < _len4; i = ++_m) {
          cell = _ref6[i];
          classes = ['datatable-cell--nullable'];
          if (sections.starts[i]) {
            classes.push('datatable-cell--section-start');
          }
          if (sections.ends[i]) {
            classes.push('datatable-cell--section-end');
          }
          formatterOptions = config.formatterOptions[aggregate.valueType] || {};
          datatable.applyFormatterOptions(formatterOptions);
          value = aggregate.formatter(cell[0][metric], formatterOptions);
          value = splitNumber(value, key);
          totalRowComp.push(
            <td key={totalRowComp.length} className={classes.join(' ')}>
              {!!value && <div dangerouslySetInnerHTML={{ __html: value }} />}
            </td>
          );
        }
      }
      if (config.showAggregates) {
        totalAggregateLookup = aggregates.tableTitles.reduce(function(h, k) {
          h[k] = true;
          return h;
        }, {});
        _ref7 = aggregates.rowTitles;
        for (i = _n = 0, _len5 = _ref7.length; _n < _len5; i = ++_n) {
          key = _ref7[i];
          value = '';
          if (totalAggregateLookup[key]) {
            aggregate = AggregateDefinitionsService.findByKey(key);
            formatterOptions =
              config.formatterOptions[aggregate.valueType] || {};
            datatable.applyFormatterOptions(formatterOptions);
            value = aggregate.formatter(
              aggregates.table[0][key],
              formatterOptions
            );
            value = splitNumber(value, key);
          }
          totalRowClass = i === 0 ? 'datatable-table-total--start' : '';
          totalRowComp.push(
            <td
              key={totalRowComp.length}
              className={`datatable-table-total ${totalRowClass} datatable-cell--nullable`}
            >
              {!!value && <div dangerouslySetInnerHTML={{ __html: value }} />}
            </td>
          );
        }
        if (this.showAggregateDropdown) {
          totalRowComp.push(
            <td
              key={totalRowComp.length}
              className="datatable-table-total datatable-table-total--empty"
            />
          );
        }
      }
    }
    if (config.showRows) {
      rowsComp = [];
      lastRowIDs = [];
      for (i = _o = 0, _len6 = rows.length; _o < _len6; i = ++_o) {
        row = rows[i];
        lastRow = i === rows.length - 1;
        isStartOfGroupRow = false;
        rowIDs = headers.rowIds[i];
        headerLabelsComp = [];
        metadataComp = [];
        _ref8 = headers.rows[i];
        for (j = _p = 0, _len7 = _ref8.length; _p < _len7; j = ++_p) {
          header = _ref8[j];
          label = header;
          if (
            config.collapseRowHeaders &&
            lastRowIDs[j] === rowIDs[j] &&
            !isStartOfGroupRow
          ) {
            label = '';
          }
          if (j === 0 && lastRowIDs[j] !== rowIDs[j]) {
            isStartOfGroupRow = true;
          }
          rowLabel = label;
          rowUrl = DimensionUrlService.getUrl(
            dimensions.row[j].key,
            rowIDs[j],
            rowLabel
          );
          headerLabelsComp.push(
            <th
              key={headerLabelsComp.length}
              colSpan={j === 0 ? 2 : 1}
              className="datatable-row-label"
            >
              {!!rowLabel.length &&
                (!!rowUrl ? (
                  <a href={rowUrl} target="_blank">
                    {escape(rowLabel)}
                  </a>
                ) : (
                  escape(rowLabel)
                ))}
            </th>
          );
        }
        if (rowMetadata != null && rowMetadata[i]) {
          _.forEach(rowMetadata[i], function(metadataValues, i) {
            if (metadataValues.length > 0) {
              return _.forEach(metadataValues, function(metadataValue, o) {
                var metadata;
                metadata = MetadataDefinitionsService.findByKey(
                  rowMetadataKeys[i][o]
                );
                value = metadata.formatter(metadataValue);
                metadataComp.push(
                  <th
                    key={metadataComp.length}
                    className="datatable-cell--nullable"
                  >
                    {escape(value)}
                  </th>
                );
              });
            }
          });
        }
        rowsClass = ['datatable-row'];
        if (isStartOfGroupRow && headers.rows[0].length > 1) {
          rowsClass.push('datatable-row--group-start');
        }
        lastRowIDs = rowIDs;
        if (config.showMetrics) {
          cellComp = [];
          valueType = definition.metric.valueType;
          metricFormatterOptions = config.formatterOptions[valueType] || {};
          datatable.applyFormatterOptions(metricFormatterOptions);
          for (j = _q = 0, _len8 = row.length; _q < _len8; j = ++_q) {
            cell = row[j];
            classes = ['datatable-cell', 'datatable-cell--nullable'];
            if (sections.starts[j]) {
              classes.push('datatable-cell--section-start');
            }
            if (sections.ends[j]) {
              classes.push('datatable-cell--section-end');
            }
            value = definition.metric.formatter(
              cell[0][metric],
              metricFormatterOptions
            );
            value = splitNumber(value, metric);
            cellComp.push(
              <td key={cellComp.length} className={classes.join(' ')}>
                {!!value && <div dangerouslySetInnerHTML={{ __html: value }} />}
              </td>
            );
          }
        }
        if (config.showAggregates) {
          aggsComp = [];
          _ref9 = aggregates.rowTitles;
          for (j = _r = 0, _len9 = _ref9.length; _r < _len9; j = ++_r) {
            key = _ref9[j];
            aggregate = AggregateDefinitionsService.findByKey(key);
            formatterOptions =
              config.formatterOptions[aggregate.valueType] || {};
            datatable.applyFormatterOptions(formatterOptions);
            value = aggregate.formatter(
              aggregates.row[i][0][key],
              formatterOptions
            );
            value = splitNumber(value, key);
            aggRowClass = j === 0 ? 'datatable-row-aggs--start' : '';
            aggsComp.push(
              <td
                key={aggsComp.length}
                className={`datatable-row-aggs ${aggRowClass} datatable-cell--nullable`}
              >
                {!!value && <div dangerouslySetInnerHTML={{ __html: value }} />}
              </td>
            );
          }
          if (config.sparklineOptions.show) {
            // To Do - Sparkline Scope Component
            aggsComp.push(
              <td key={aggsComp.length} className="datatable-row-aggs" />
            );
          }
          if (this.showAggregateDropdown) {
            aggsComp.push(
              <td
                key={aggsComp.length}
                className="datatable-row-aggs datatable-row-aggs--empty"
              />
            );
          }
        }
        rowsComp.push(
          <tr
            key={rowsComp.length}
            className={classnames(rowsClass.join(' '), {
              'datatable-row--last': datatable.canLoadMore && lastRow
            })}
          >
            {headerLabelsComp}
            {metadataComp}
            {cellComp}
            {aggsComp}
          </tr>
        );
      }
    }
    if (config.showMetricAggregates) {
      colAggsComp = [];
      aggregates = datatable.data.aggregates;
      _ref10 = aggregates.columnTitles;
      for (i = _t = 0, _len11 = _ref10.length; _t < _len11; i = ++_t) {
        key = _ref10[i];
        aggregate = AggregateDefinitionsService.findByKey(key);
        colAggsMetricsComp = [];
        if (config.showMetrics) {
          _ref11 = aggregates.column;
          for (i = _u = 0, _len12 = _ref11.length; _u < _len12; i = ++_u) {
            cell = _ref11[i];
            classes = ['datatable-col-aggs', 'datatable-cell--nullable'];
            if (i + 1 === aggregates.column.length) {
              classes.push('datatable-cell--last-col');
            }
            if (sections.starts[i]) {
              classes.push('datatable-cell--section-start');
            }
            if (sections.ends[i]) {
              classes.push('datatable-cell--section-end');
            }
            formatterOptions =
              config.formatterOptions[aggregate.valueType] || {};
            datatable.applyFormatterOptions(formatterOptions);
            value = aggregate.formatter(cell[0][key], formatterOptions);
            value = splitNumber(value, key);
            colAggsMetricsComp.push(
              <td key={colAggsMetricsComp.length} className={classes.join(' ')}>
                {!!value && <div dangerouslySetInnerHTML={{ __html: value }} />}
              </td>
            );
          }
        }
        if (config.showAggregates) {
          emptyColSpan = aggregates.rowTitles.length;
          if (config.showAggregates) {
            emptyColSpan += 1;
          }
          if (metadataColLength) {
            emptyColSpan += metadataColLength;
          }
          colAggsMetricsComp.push(
            <td
              key={colAggsMetricsComp.length}
              colSpan={emptyColSpan}
              className="datatable-cell-empty"
            />
          );
        }
        colAggsComp.push(
          <tr key={colAggsComp.length} className="datatable-col-aggs-row">
            {_t === 0 && (
              <th
                rowSpan={aggregates.columnTitles.length}
                className="datatable-col-aggs-header"
              >
                <div className="datatable-col-aggs-header-outer">
                  <div className="datatable-col-aggs-header-inner">
                    Totals By Date Range
                  </div>
                </div>
              </th>
            )}
            <th
              colSpan={headers.rows[0].length + metadataColLength}
              className="datatable-col-aggs-label"
            >
              {aggregate.name}
            </th>
            {colAggsMetricsComp}
          </tr>
        );
      }
    }
    tableComp = (
      <table className={tableClasses.join(' ')}>
        <thead>
          {config.showColumnHeaders && (
            <tr className="datatable-col-header-row">{headerComp}</tr>
          )}
          <tr className="datatable-col-labels-row">{labelsComp}</tr>
        </thead>
        <tbody>
          {config.showTotalsTop && (
            <tr className="datatable-col-totals-row datatable-col-totals-row--top">
              {totalRowComp}
            </tr>
          )}
          {rowsComp}
          {config.showMetricSummary &&
            (!datatable.canLoadMore || !datatable.paginated) && (
              <tr className="datatable-col-totals-row">{totalRowComp}</tr>
            )}
        </tbody>
        {(!datatable.canLoadMore || !datatable.paginated) && (
          <tfoot>{colAggsComp}</tfoot>
        )}
        <colgroup>
          {new Array(row_titles.length + metadataColLength + 1)
            .fill(0)
            .map((_, i) => <col key={i} />)}
        </colgroup>
        <colgroup>
          {new Array(headers.columns.length)
            .fill(0)
            .map((_, i) => <col key={i} />)}
        </colgroup>
        <colgroup>
          {new Array(aggregates.rowTitles.length)
            .fill(0)
            .map((_, i) => <col key={i} />)}
        </colgroup>
      </table>
    );
    this.updatedTable = tableComp;
    var mouseOverHandler = function(event) {
      var col, colgroup, colgroups, index, eventTarget;
      colgroups = target.getElementsByTagName('colgroup');
      colgroup = colgroups[1];
      col = colgroup.getElementsByTagName('col');
      eventTarget = event.target;
      index = whichChild(eventTarget) - row_titles.length - metadataColLength;
      if (index < 0) {
        eventTarget =
          findAncestor(eventTarget, 'datatable-cell') ||
          findAncestor(eventTarget, 'datatable-col-label');
        index = whichChild(eventTarget) - row_titles.length - metadataColLength;
        if (index < 0) return;
      }
      return (col[index].className += ' datatable-col--hover');
    };
    var mouseOutHandler = function(event) {
      var col, colgroup, colgroups, index, eventTarget;
      colgroups = target.getElementsByTagName('colgroup');
      colgroup = colgroups[1];
      col = colgroup.getElementsByTagName('col');
      eventTarget = event.target;
      index = whichChild(eventTarget) - row_titles.length - metadataColLength;
      if (index < 0) {
        eventTarget =
          findAncestor(eventTarget, 'datatable-cell') ||
          findAncestor(eventTarget, 'datatable-col-label');
        index = whichChild(eventTarget) - row_titles.length - metadataColLength;
        if (index < 0) return;
      }
      return (col[index].className = col[index].className.replace(
        ' datatable-col--hover',
        ''
      ));
    };
    this.setState({ renderedCount: this.state.renderedCount + 1 }, () => {
      var cells = [];
      var elements = document.querySelectorAll('.datatable-cell');
      for (i = 0; i < elements.length; i++) {
        cells.push(elements[i]);
      }
      elements = document.querySelectorAll('.datatable-col-label');
      for (i = 0; i < elements.length; i++) {
        cells.push(elements[i]);
      }
      cells.forEach(cell => {
        cell.addEventListener('mouseover', mouseOverHandler, false);
        cell.addEventListener('mouseout', mouseOutHandler, false);
      });
    });
  }

  render() {
    const { config, reportDatatable } = this.props;
    return (
      <div>
        {reportDatatable.loading && <div>Loading...</div>}
        {!reportDatatable.error && (
          <datatable id="datatable-container">
            {this.updatedTable}
            <div className="datatable-footer-actions">
              {reportDatatable.canLoadMore &&
                reportDatatable.paginated && (
                  <button className="datatable-load-more-button button">
                    {config.loadMoreText}&hellip;
                  </button>
                )}
            </div>
          </datatable>
        )}
        {!!reportDatatable.noResults && (
          <div className="datatable-no-results-message">
            {config.noResultsMessage}
          </div>
        )}
      </div>
    );
  }
}

export default DataTable;
