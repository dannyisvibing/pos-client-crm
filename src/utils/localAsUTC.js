import moment from 'moment';

function LocalAsUTCize(date) {
  var local;
  local = moment(date);
  return local.add(local.utcOffset(), 'minutes').toDate();
}

export default LocalAsUTCize;
