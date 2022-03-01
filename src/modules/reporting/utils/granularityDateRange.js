import granularityDateFilter from './granularityDate';

function granularityDateRange(startDate, endDate, format, separator) {
  var dateRange;
  if (separator == null) {
    separator = '-';
  }
  dateRange = granularityDateFilter(startDate, format);
  endDate = granularityDateFilter(endDate, format);
  if (dateRange !== endDate) {
    dateRange += ' ' + separator + ' ' + endDate;
  }
  return dateRange;
}

export default granularityDateRange;
