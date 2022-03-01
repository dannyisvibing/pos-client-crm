import moment from 'moment';
import LocalAsUTCize from '../../../utils/localAsUTC';

export default class Period {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  localAsUTC() {
    return {
      start: LocalAsUTCize(this.start),
      end: LocalAsUTCize(this.end)
    };
  }

  lengthInDays() {
    return moment(this.end).diff(this.start, 'days');
  }
}
