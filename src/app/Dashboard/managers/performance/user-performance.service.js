import { divide, multiply } from 'vend-number';

import Period from '../../constants/period.enum';
import PerformanceService from './performance.service';
import rbUserReportService from '../report/user-report.service';
import rbReportService from '../report/report.service';

class RBUserPerformanceService extends PerformanceService {
  constructor() {
    super(rbUserReportService);
  }

  _formatData(reportData, user) {
    // UserPerformanceData
    const performanceData = super._formatData(reportData, user);

    performanceData.totalRevenue = rbReportService.getAggregate(
      reportData.current,
      'totalRevenue'
    );
    const targetRevenue = this._getTargetRevenue(user, reportData.period);

    // When target revenue is set, calculate progress.
    // Total Sales Revenue for Period / Target Revenue for Period
    const targetProgress = targetRevenue
      ? divide(performanceData.totalRevenue, targetRevenue)
      : 0;
    // Progress ratio * 100% and floored down to nearest integer
    performanceData.targetProgressPercent = Math.floor(
      multiply(targetProgress, 100)
    );
    performanceData.targetRevenue = targetRevenue;

    return performanceData;
  }

  /**
   * Retrieves the target revenue set for the user and for the current period.
   *
   * @private
   * @method _getTargetRevenue
   *
   * @param  {User} user
   * @param  {Period} period
   *
   * @return {Number} The revenue target set for the User
   */
  _getTargetRevenue(user, period) {
    const targetKeys = {
      [Period.Day]: 'targetDaily',
      [Period.Week]: 'targetWeekly',
      [Period.Month]: 'targetMonthly'
    };

    return user[targetKeys[period]];
  }
}

const rbUserPerformanceService = new RBUserPerformanceService();
export default rbUserPerformanceService;
