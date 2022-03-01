export default class PermanceService {
  // entityReportService: EntityReportService
  constructor(entityReportService) {
    this._entityReportService = entityReportService;
  }

  /**
   * Get the performance data for the given entity (e.g. user or outlet) over the given period of time.
   *
   * @method getPerformanceData
   *
   * @param  {} entity
   * @param  {Period} period
   *
   * @return {Promise<D>}
   */
  getPerformanceData(entity, period) {
    return this._entityReportService.getData().then(data => {
      return this._formatData(data, entity);
    });
  }

  _formatData(reportData, entity) {
    return {
      reportData,
      chartData: this._entityReportService.getChartData(
        reportData,
        'totalRevenue'
      )
    };
  }
}
