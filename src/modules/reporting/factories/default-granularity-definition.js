import moment from 'moment';

const definitions = [
  {
    name: 'Year',
    key: 'year',
    type: 'DATE',
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('YYYY');
    },
    val: 'year',
    sortOrder: 6
  },
  {
    name: 'Quarter',
    key: 'quarter',
    type: 'DATE',
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('[Q]Q');
    },
    val: 'quarter',
    sortOrder: 5
  },
  {
    name: 'Month',
    key: 'month',
    type: 'DATE',
    sort: function(a, b) {
      return moment(a, 'MMM YYYY').diff(moment(b, 'MMM YYYY'), 'days');
    },
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('MMM');
    },
    val: 'month',
    sortOrder: 4
  },
  {
    name: 'Week',
    key: 'week',
    type: 'DATE',
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('Do MMM');
    },
    val: 'week',
    sortOrder: 3,
    default: true
  },
  {
    name: 'Day',
    key: 'day',
    type: 'DATE',
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('ddd Do');
    },
    val: 'day',
    sortOrder: 2
  },
  {
    name: 'Hour',
    key: 'hour',
    type: 'DATE',
    reportHeaderFormat: 'Do MMM YYYY',
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('HH:00');
    },
    val: 'hour',
    sortOrder: 1
  },
  {
    name: 'Range',
    key: 'range',
    type: 'DATE',
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('ddd Do');
    },
    val: 'range',
    hidden: true
  },
  {
    name: 'All Time',
    key: 'all',
    type: 'DATE',
    format: null,
    val: 'all',
    hidden: true
  },
  {
    name: 'Single',
    key: 'single',
    type: 'DATE',
    format: function(d) {
      return moment(+d.date)
        .utc()
        .format('ddd Do');
    },
    val: 'single',
    hidden: true
  }
];

export default definitions;
