import EntityReportService from './entity-report.service';
import USER_REPORT_DEFINITION from './user-report-definition';
import rbReportService from './report.service.js';

/**
 * Service for querying the user reporting data.
 *
 * @class UserReportService
 */
class RBUserReportService extends EntityReportService {
  constructor() {
    super(rbReportService, USER_REPORT_DEFINITION);
  }

  _getConstraints(user) {
    return [
      {
        id: user.userId,
        type: 'user'
      }
    ];
  }
}

const rbUserReportService = new RBUserReportService();
export default rbUserReportService;
