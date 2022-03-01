import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import * as flatten from 'lodash/flatten';
import * as keyBy from 'lodash/keyBy';
import * as uniq from 'lodash/uniq';

import { getStartOfTimeUnit, getGranularity } from '../../utils/periodUtils';
import rbReportService from '../report/report.service';

import { TOP_SALES_PEOPLE_BY_REVENUE } from './top-sales-people-reports.constant';
import request from '../../../../utils/http';

export default class TopSalesPeopleService {
  static getPerformanceData(outlet, period) {
    const constraints = [];
    if (outlet) {
      constraints.push({
        id: outlet.outletId,
        type: 'outlet'
      });
    }

    const periodString = getStartOfTimeUnit(period);
    const reportPeriod = {
      start: moment().startOf(periodString),
      end: moment().endOf(periodString),
      granularity: getGranularity(period)
    };

    const formattedPeriod = rbReportService.getFormattedPeriod(reportPeriod);
    const definition = cloneDeep(TOP_SALES_PEOPLE_BY_REVENUE);
    definition.order[0].period = formattedPeriod;

    return (
      rbReportService
        .getData(definition, reportPeriod, { constraints })
        /**
         * @return {ReportData}
         */
        .then(report => this._processReportData(report))
    );
  }

  /**
   * Process the report data returned by the reporting API into SalesPersonPerformance objects digestable by the UI.
   *
   * @private
   * @method _processReportData
   *
   * @param  {ReportData[]} report
   *
   * @return {Promise<SalesPersonPerformance[]>}
   */
  static _processReportData(report) {
    return this._fetchUsers(report).then(users =>
      this._createSalesPersonPerformances(report, 'totalRevenue', users)
    );
  }

  /**
   * Fetch the full user objects for the users referenced by the given report.
   *
   * @private
   * @method _fetchUsers
   *
   * @param  {ReportData} report
   *
   * @return {Promise<{ [key: string]: Hash }>} A promise that resolves to a map of user ID to user object
   */
  static _fetchUsers(report) {
    const userIds = uniq(flatten(report.headers.row_ids));

    return request({
      url: '/users',
      params: { ids: userIds }
    })
      .then(response => response.data)
      .then(users => keyBy(users, 'userId'));
  }

  /**
   * Create an array of SalesPersonPerformance objects from the given report data.
   *
   * @private
   * @method _createSalesPersonPerformances
   *
   * @param  {ReportData} report
   *         The report containing the sales people performance data
   * @param  {string} valueKey
   *         The name of the property containing the performance value for each user
   * @param  {Map<string, Hash>} users
   *         Map of user ID to user to look up full user details
   *
   * @return {SalesPersonPerformance[]}
   */
  static _createSalesPersonPerformances(report, valueKey, users) {
    const userIds = flatten(report.headers.rowIds);

    return report.aggregates.row((row, index) => {
      const user = users[userIds[index]];
      const value = row[0][valueKey];
      return { user, value };
    });
  }
}
