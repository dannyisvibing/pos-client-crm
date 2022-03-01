import PerformanceService from './performance.service';
import rbOutletReportService from '../report/outlet-report.service';

class RBOutletPerformanceService extends PerformanceService {
  constructor() {
    super(rbOutletReportService);
  }
}

const rbOutletPerformanceService = new RBOutletPerformanceService();
export default rbOutletPerformanceService;
