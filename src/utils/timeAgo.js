import moment from 'moment';

const timeAgo = utcDate => {
  return utcDate ? moment(utcDate, 'YYYY-MM-DD HH:mm:SS ZZ').fromNow() : '';
};

export default timeAgo;
