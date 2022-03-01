import moment from 'moment';

function granularityDate(date, format) {
  var dateFormat;
  dateFormat = format || 'Do MMM YYYY';
  return moment(date).format(dateFormat);
}

export default granularityDate;
