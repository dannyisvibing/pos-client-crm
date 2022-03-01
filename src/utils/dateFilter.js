import _ from 'lodash';
import moment from 'moment';

function baseFormat(date) {
  var now;
  now = moment();
  if (date.year() === now.year() || moment().diff(date, 'months') < 11) {
    return 'Do MMM';
  } else {
    return 'Do MMM, YYYY';
  }
}

function dateFilter(defaults) {
  if (defaults == null) {
    defaults = {};
  }
  return function(value, options) {
    var date;
    if (value == null) {
      value = 0;
    }
    if (options == null) {
      options = {};
    }
    if (!(value > 0)) {
      return '';
    }
    _.defaults(options, defaults);
    date = moment(value);
    options.format || (options.format = baseFormat(date));
    return date.format(options.format);
  };
}

export default dateFilter;
