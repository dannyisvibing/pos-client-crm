import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import * as flatten from 'lodash/flatten';
import * as keyBy from 'lodash/keyBy';
import * as uniq from 'lodash/uniq';

import {
  TOP_PRODUCTS_BY_COUNT,
  TOP_PRODUCTS_BY_REVENUE
} from './product-performance-report.constants';
import { getStartOfTimeUnit, getGranularity } from '../../utils/periodUtils';
import rbReportService from '../report/report.service';
import request from '../../../../utils/http';

export const ProductsBy = {
  BY_COUNT: 'topByCount',
  BY_REVENUE: 'topByRevenue'
};

export default class ProductPerformanceService {
  /**
   * Get the product performance data for the current outlet and period.
   *
   * @method getPerformanceData
   *
   * @param  {Hash} outlet
   * @param  {Period} period
   *
   * @return {IPromise<ProductPerformanceData>}
   */
  static getPerformanceData(outlet, period) {
    const constraints = [
      {
        id: 'true',
        type: 'exclude_gift_cards'
      }
    ];

    if (outlet) {
      constraints.push({
        id: outlet.outletId,
        type: 'outlet'
      });
    }

    const options = { constraints };
    const periodString = getStartOfTimeUnit(period);
    const reportPeriod = {
      start: moment().startOf(periodString),
      end: moment().endOf(periodString),
      granularity: getGranularity(period)
    };

    const formattedPeriod = rbReportService.getFormattedPeriod(reportPeriod);
    const topByCount = this._buildReportQueryData(
      TOP_PRODUCTS_BY_COUNT,
      reportPeriod,
      options,
      formattedPeriod
    );
    const topByRevenue = this._buildReportQueryData(
      TOP_PRODUCTS_BY_REVENUE,
      reportPeriod,
      options,
      formattedPeriod
    );

    return (
      rbReportService
        .getReports([topByCount, topByRevenue])
        /**
         * @return {ReportData[]}
         */
        .then(reports => this._processReports(reports))
    );
  }

  /**
   * Build the ReportQueryData to query product performance based on the given report definition and period.
   *
   * @private
   * @method _buildReportQueryData
   *
   * @param  {ReportDefinition} reportDefinition
   * @param  {ReportPeriod} period
   * @param  {ReportDefinitionOptions} options
   * @param  {FormattedPeriod} formattedPeriod
   *
   * @return {ReportQueryData}
   */
  static _buildReportQueryData(
    reportDefinition,
    period,
    options,
    formattedPeriod
  ) {
    const definition = cloneDeep(reportDefinition);
    definition.order[0].period = formattedPeriod;
    return { definition, period, options };
  }

  /**
   * Process the reports returned by the reporting API into ProductPerformanceData digestable by the UI.
   *
   * @private
   * @method _processReports
   *
   * @param  {ReportData[]} reports
   *
   * @return {Promise<ProductPerformanceData>}
   */
  static _processReports(reports) {
    return this._fetchProducts(reports).then(products => {
      const [topByCount, topByRevenue] = reports;
      return {
        topByCount: this._createProductPerformances(
          topByCount,
          'itemCount',
          products
        ),
        topByRevenue: this._createProductPerformances(
          topByRevenue,
          'totalRevenue',
          products,
          true
        )
      };
    });
  }

  /**
   * Fetch the full product objects for the products referenced by the given reports.
   *
   * @private
   * @method _fetchProducts
   *
   * @param  {ReportData[]} reports
   *
   * @return {Promise<{ [key: string]: Hash }>} A promise that resolves to a map of product ID to product object
   */
  static _fetchProducts(reports) {
    const productIds = reports.reduce(
      (ids, report) => ids.concat(flatten(report.headers.row_ids)),
      []
    );

    return request({
      url: '/products',
      params: { ids: uniq(productIds) }
    })
      .then(response => response.data)
      .then(products => keyBy(products, 'id'));
  }

  /**
   * Create an array of ProductPerformance objects from the given report data.
   *
   * @private
   * @method _createProductPerformances
   *
   * @param  {ReportData} report
   *         The report containing the product performance data
   * @param  {string} valueKey
   *         The name of the property containing the performance value for each product
   * @param  {{ [key: string]: Hash }} products
   *         Map of product ID to product to look up full product details
   * @param  {boolean} [currency=false]
   *         Whether the metric measuring performance is a currency or not
   *
   * @return {ProductPerformance[]}
   */
  static _createProductPerformances(report, valueKey, products, currency) {
    const productIds = flatten(report.headers.rowIds);
    return report.aggregates.row.map((row, index) => {
      const product = products[productIds[index]];
      const value = row[0][valueKey];
      return { product, value, currency };
    });
  }
}
