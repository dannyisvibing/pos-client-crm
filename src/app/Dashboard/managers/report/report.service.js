import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import * as endsWith from 'lodash/endsWith';
import * as forEach from 'lodash/forEach';
import * as map from 'lodash/map';
import * as mapKeys from 'lodash/mapKeys';
import * as zipWith from 'lodash/zipWith';

import {
  getGranularity,
  getPreviousDuration,
  getStartOfTimeUnit
} from '../../utils/periodUtils';
import rbReportingResource from '../../../../modules/reporting/reporting.resource';

const TAX_SENSITIVE_PROPERTIES = ['totalRevenue', 'basketValue'];
const TAX_INCLUSIVE_SUFFIX = 'Incl';
// const PRODUCT_COSTS_PERMISSION = 'product.cost.view';
// const RESTRICTED_AGGREGATES = {
//   [PRODUCT_COSTS_PERMISSION]: [
//     'totalCost',
//     'grossProfit',
//     'margin',
//     'inventoryValue',
//     'inventoryAvgValue'
//   ]
// };

/**
 * Refer to report.interfaces.ts file for the interfaces
 */

export default class RBReportService {
  /**
   * Get the collection of report data for the given report definintion relevant to the given period.
   *
   * @method getDataForPeriod
   *
   * @param  {ReportDefinition} definition
   * @param  {Period} period
   * @param  {ReportDefinitionOptions} [options={}]
   *
   * @return {Promise<PeriodReportData>}
   */
  static getDataForPeriod(definition, period, options = {}) {
    /**
     * @type {ReportPeriod}
     */
    const periods = this._createReportPeriods(period);
    /**
     * @type {ReportQueryData}
     */
    const reportQueries = [
      { definition, period: periods.current, options },
      { definition, period: periods.previous, options },
      { definition, period: periods.partialPrevious, options }
    ];

    return this.getReports(reportQueries).then(
      ([current, previous, partialPrevious]) => {
        return { period, current, previous, partialPrevious };
      }
    );
  }

  /**
   * Get the data for the given report definition over the specified periods of time.
   *
   * @method getData
   *
   * @param  {ReportDefinition} baseReportDefinition
   * @param  {ReportPeriod} period
   * @param  {ReportDefinitionOptions} [options={}]
   *
   * @return {Promise<ReportData>}
   */
  static getData(baseReportDefinition, period, options) {
    const reportDefinition = this._createReportDefinition(
      baseReportDefinition,
      period,
      options
    );
    return this._getData(reportDefinition);
  }

  /**
   * Bulk request report data from the reporting API.
   *
   * @method getReports
   *
   * @param  {ReportQueryData[]} reportQueries
   *         Array of report query data containing the report definition, period and additional options for each of
   *         the reports to request from the API
   *
   * @return {Promise<ReportData[]>}
   */
  static getReports(reportQueries) {
    const reportDefinitions = reportQueries.map(queryData => {
      return this._createReportDefinition(
        queryData.definition,
        queryData.period,
        queryData.options
      );
    });

    return this._getReports(reportDefinitions);
  }

  /**
   * Given a Report Period returns an object with correctly formatted date strings required for the reporting API
   *
   * @method getFormattedPeriod
   *
   * @param  {ReportPeriod} period
   *
   * @return {FormattedPeriod} An object with formatted date strings for the start and end properties
   */
  static getFormattedPeriod(period) {
    return {
      start: this.formatDateAsUtc(period.start),
      end: this.formatDateAsUtc(period.end)
    };
  }

  /**
   * Formats the local date as if it were a UTC date. I.e. the actual wall time remains the same but the offset is
   * changed to UTC.
   *
   * Example:
   * Given a date of `2016-02-12T00:00:00+13:00` in the New Zealand timezone would format as if it were the same time
   * in UTC: `2016-02-12T00:00:00Z`.
   *
   * @method formatDateAsUtc
   *
   * @param  {Date|string|moment.Moment} date
   *         A date object, moment instance or valid date string
   *
   * @return {String} The equivalent date formatted as a string as if it were in the UTC timezone
   */
  static formatDateAsUtc(date) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ss[Z]');
  }

  /**
   * Convert the given report data into a series of x, y values suitable to plot on a chart.
   * Updates the previous period's x values to match the current period so they plot on top of each other on the x axis.
   *
   * @method getChartData
   *
   * @param  {PeriodReportData} data
   * @param  {string} aggregate The name of the aggregate property in the report to plot on the chart
   *
   * @return {Hash[]}
   */
  static getChartData(data, aggregate) {
    const currentChartData = this._convertReportToPlotPoints(
      data.current,
      aggregate
    );
    const previousPeriodDuration = getPreviousDuration(data.period);
    let previousChartData = this._convertReportToPlotPoints(
      data.previous,
      aggregate
    );
    // Update the previous period's x values to match the current period
    // so the lines plot on top of each other and can be compared
    previousChartData = map(previousChartData, (data, index) => {
      data.x = moment(data.x)
        .utc()
        .add(previousPeriodDuration)
        .toDate();
      return data;
    });

    return [currentChartData, previousChartData];
  }

  /**
   * Get the specified aggregate value from the given report data.
   *
   * @method getAggregate
   *
   * @param {ReportData} reportData
   * @param {string} aggregate The name of the aggregate property in the report to get e.g. total_revenue
   *
   * @return {number}
   */
  static getAggregate(reportData, aggregate) {
    const aggregateData = reportData.aggregates.table.length
      ? reportData.aggregates.table[0]
      : {};
    return aggregateData[aggregate];
  }

  /**
   * Create the relevant ReportPeriods to query based on the given Period.
   *
   * @private
   * @method _createReportPeriods
   *
   * @param  {Period} period
   *
   * @return {{ [key: string]: ReportPeriod }}
   */
  static _createReportPeriods(period) {
    const startOfPeriodString = getStartOfTimeUnit(period);
    const start = moment().startOf(startOfPeriodString);
    const granularity = getGranularity(period);
    const end = moment();

    const current = {
      // ReportPeriod
      start,
      end,
      granularity
    };

    const previousPeriodDuration = getPreviousDuration(period);
    const startPrev = moment(start).subtract(previousPeriodDuration);

    const previous = {
      // ReportPeriod
      start: startPrev,
      end: moment()
        .endOf(startOfPeriodString)
        .subtract(previousPeriodDuration),
      granularity
    };

    const partialPrevious = {
      // ReportPeriod
      start: startPrev,
      end: moment(end).subtract(previousPeriodDuration),
      granularity
    };

    return { current, previous, partialPrevious };
  }

  /**
   * Create a new ReportDefinition instance based off the given base report definition and applying the constraints etc
   * from the given options.
   *
   * @private
   * @method _createReportDefinition
   *
   * @param  {ReportDefinition} baseReportDefinition
   * @param  {ReportPeriod} period
   * @param  {ReportDefinitionOptions} [options={}]
   *
   * @return {ReportDefinition}
   */
  static _createReportDefinition(baseReportDefinition, period, options = {}) {
    const reportDefinition = cloneDeep(baseReportDefinition);

    // @todo
    // forEach(RESTRICTED_AGGREGATES, (excludedAggregates, permission) => {
    //   if (!rbActiveUser.hasPermission(permission)) {
    //     this._excludeAggregates(reportDefinition, excludedAggregates);
    //   }
    // });

    // To Do - check if retailer has tax_exclusive setting.
    // if retailer is not tax exclusive, be tax inclusive
    // !rbRetailer.get().tax_exclusive
    if (false) {
      this._taxInclusivizeReportDefinition(reportDefinition);
    }

    reportDefinition.dimensions.column = [{ key: period.granularity }];
    reportDefinition.periods = [this.getFormattedPeriod(period)];

    if (options.constraints) {
      reportDefinition.constraints = options.constraints;
    }

    return reportDefinition;
  }

  /**
   * Query the report data from the reporting API based on the given report definition.
   *
   * @private
   * @method _getData
   *
   * @param  {ReportDefinition} reportDefinition
   *
   * @return {Promise<ReportData>}
   */
  static _getData(reportDefinition) {
    return (
      rbReportingResource
        .report(reportDefinition)
        /**
         * @return {ReportData}
         */
        .then(data => {
          data = data.dashboardData;
          // To Do - Check if retailer is tax exclusive. If not exclusive, agnosticize report data
          if (false) {
            this._taxAgnosticizeReportData(data);
          }
          return data;
        })
    );
  }

  /**
   * Bulk query the report data from the reporting API based on the given report definitions.
   *
   * @private
   * @method _getReports
   *
   * @param  {ReportDefinition[]} reportDefinitions
   *
   * @return {Promise<ReportData[]>}
   */
  static _getReports(reportDefinitions) {
    return (
      rbReportingResource
        .reports(reportDefinitions)
        /**
         * @return {ReportData[]}
         */
        .then(data => {
          // To Do - Check if retailer is tax exclusive. If not exclusive, agnosticize report data
          if (false) {
            data.forEach(reportData =>
              this._taxAgnosticizeReportData(reportData)
            );
          }
          return data;
        })
    );
  }

  /**
   * Update the given report definition to exclude aggregates passed in the defined config
   *
   * @private
   * @method _excludeAggregates
   *
   * @param {ReportDefinition} reportDefinition
   * @param {string[]} excludedAggregates
   */
  static _excludeAggregates(reportDefinition, excludedAggregates) {
    forEach(reportDefinition.aggregates, (properties, aggregateKey) => {
      reportDefinition.aggregates[aggregateKey] = properties.filter(prop => {
        return excludedAggregates.indexOf(prop) === -1;
      });
    });

    reportDefinition.order = reportDefinition.order.filter(order => {
      return excludedAggregates.indexOf(order.metric) === -1;
    });
  }

  /**
   * Update the given report definition, converting tax-exclusive property names to their tax-inclusive equivalents.
   *
   * @private
   * @method _taxInclusivizeReportDefinition
   *
   * @param {ReportDefinition} reportDefinition
   */
  static _taxInclusivizeReportDefinition(reportDefinition) {
    forEach(reportDefinition.aggregates, properties => {
      forEach(properties, (property, index) => {
        properties[index] = this._taxInclusivizeProperty(property);
      });
    });

    forEach(reportDefinition.order, orderConfig => {
      if (orderConfig.metric) {
        orderConfig.metric = this._taxInclusivizeProperty(orderConfig.metric);
      }
    });
  }

  /**
   * Convert the given property into its tax-inclusive equivalent e.g. total_revenue => total_revenue_incl.
   *
   * @private
   * @method _taxInclusivizeProperty
   *
   * @param  {string} property
   *
   * @return {string} The tax-inclusive equivalent of the given property name
   */
  static _taxInclusivizeProperty(property) {
    if (TAX_SENSITIVE_PROPERTIES.indexOf(property) > -1) {
      return `${property}${TAX_INCLUSIVE_SUFFIX}`;
    }
    return property;
  }

  /**
   * Update the given report data, converting tax-inclusive property names to their tax-agnostic equivalents.
   *
   * @private
   * @method _taxAgnosticizeReportData
   *
   * @param  {ReportData} reportData
   */
  static _taxAgnosticizeReportData(reportData) {
    forEach(reportData.rows, row => {
      forEach(row, column => this._taxExclusiveReportResults(column));
    });

    forEach(reportData.aggregates, (aggregate, key) => {
      switch (key) {
        case 'rowTitles':
        case 'columnTitles':
        case 'tableTitles':
          forEach(aggregate, (property, index) => {
            aggregate[index] = this._taxAgnosticizeProperty(property);
          });
          break;
        case 'row':
        case 'column':
          forEach(aggregate, totals => this._taxExclusiveReportResults(totals));
          break;
        case 'table':
          this._taxExclusiveReportResults(aggregate);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Update the given array of report results, converting tax-inclusive property names to their tax-agnostic
   * equivalents.
   *
   * @private
   * @method _taxExclusiveReportResults
   *
   * @param  {Hash[]} reportResults
   */
  static _taxExclusiveReportResults(reportResults) {
    forEach(reportResults, (result, index) => {
      reportResults[index] = mapKeys(result, (value, property) =>
        this._taxAgnosticizeProperty(property)
      );
    });
  }

  /**
   * Convert the given property into its tax-agnostic equivalent e.g. total_revenue_incl => total_revenue.
   *
   * @private
   * @method _taxAgnosticizeProperty
   *
   * @param  {string} property
   *
   * @return {string} The tax-agnostic equivalent of the given property name
   */
  static _taxAgnosticizeProperty(property) {
    if (endsWith(property, TAX_INCLUSIVE_SUFFIX)) {
      return property.substring(
        0,
        property.length - TAX_INCLUSIVE_SUFFIX.length
      );
    }
    return property;
  }

  /**
   * Convert the given report data into a series of x, y values suitable to plot on a chart.
   *
   * @private
   * @method _convertReportToPlotPoints
   *
   * @param  {ReportData} reportData
   * @param  {string} aggregate The name of the aggregate property in the report to plot on the chart
   *
   * @return {Hash[]}
   */
  static _convertReportToPlotPoints(reportData, aggregate) {
    const dateValues = reportData.headers.columns;
    const aggregateValues = reportData.aggregates.column;

    const plotPoints = zipWith(
      dateValues,
      aggregateValues,
      (date, aggregates) => {
        return {
          x: moment(parseFloat(date[0])).toDate(),
          y: aggregates[0][aggregate]
        };
      }
    );
    return plotPoints;
  }
}
