import { trimDataset } from '../../utils/chartUtils';
import Period from '../../constants/period.enum';

export default class RBEntityReportService {
  constructor(reportService, reportDefinition) {
    this._reportService = reportService;
    this._reportDefinition = reportDefinition;
  }

  getData() {
    let currentPromiseForData = this._promiseForData;

    if (!this._promiseForData) {
      // If getData() has been invoked before loadData() set up a deferred that will be resolved by loadData()
      if (!this._pendingPromiseForData) {
        this._pendingPromiseForData = new Promise(
          resolve => (this._pendingPromiseResolver = resolve)
        );
      }

      currentPromiseForData = this._pendingPromiseForData;
    }

    return currentPromiseForData.then(data => {
      if (currentPromiseForData !== this._promiseForData) {
        // If the promise resolves but there's a new promise set by loadData() then the data we have is now out of date
        // so call getData() again to wait for the new promise
        return this.getData();
      }
      return data;
    });
  }

  loadData(entity, period) {
    const constraints = this._getConstraints(entity);
    this._promiseForData = this._reportService.getDataForPeriod(
      this._reportDefinition,
      period,
      { constraints }
    );

    if (this._pendingPromiseForData) {
      // getData() was invoked before loadData() - resolve the pending promise so it can resolve to the data we just
      // requested
      this._pendingPromiseResolver();
      this._pendingPromiseForData = null;
    }

    return this.getData();
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
  getChartData(data, aggregate) {
    let chartData = this._reportService.getChartData(data, aggregate);

    if (data.period === Period.Day) {
      // Trim starting and ending zero y values for the 24 hr day period
      chartData = trimDataset(chartData, 'y');
    }

    return chartData;
  }

  _getConstraints(entity) {
    return [];
  }
}
