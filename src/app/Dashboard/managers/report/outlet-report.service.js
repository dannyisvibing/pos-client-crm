import EntityReportService from './entity-report.service';
import { OUTLET_REPORT_DEFINITION } from './outlet-report-definition.constants';
import rbReportService from './report.service.js';

class RBOutletReportService extends EntityReportService {
  constructor() {
    super(rbReportService, OUTLET_REPORT_DEFINITION);
  }

  _getConstraints(outlet) {
    var constraints = super._getConstraints(outlet);
    if (outlet) {
      constraints.push({
        id: outlet.outletId,
        type: 'outlet'
      });
    }

    return constraints;
  }
}

const rbOutletReportService = new RBOutletReportService();
export default rbOutletReportService;
