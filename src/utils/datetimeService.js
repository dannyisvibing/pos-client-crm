import moment from 'moment';

export default class DatetimeService {
  static localOffset(string) {
    return moment(Date.parse(string)).format('Z');
  }
  static parseKey(key) {
    return this.ensureValid(new Date(Date.parse(key + this.localOffset(key))));
  }
  static slugify(date) {
    return moment(date).format('YYYY-MM-DD[T]HH[:00:00]');
  }
  static inFuture(date) {
    return moment().diff(date) < 0;
  }
  static afterTomorrow(date) {
    return moment().diff(date, 'days') < 0;
  }
  static ensureValid(date) {
    if (isNaN(date) || this.inFuture(date)) {
      return new Date();
    } else {
      return date;
    }
  }
}
