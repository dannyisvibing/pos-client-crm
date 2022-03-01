import ReportDatatable from './report-datatable';

export default class ReportView {
  constructor(attr) {
    this.datatable = new ReportDatatable(attr.data);
    this.period = attr.period;
    this.aggregation = attr.aggregation;
    this.formatter = this.aggregation.formatter;
    this.title = attr.title;
  }
}
