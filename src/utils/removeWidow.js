import _ from 'lodash';

function removeWidow(input) {
  if (!input || !_.isString(input)) {
    return input;
  }

  // Match a white space char (\s) next to a group of non white space characters (\S+ 0 max 20 chars) at the end ($)
  // of the provided input and replace the space with a unicode representation of &nbsp
  // (to get around angular sanitizing).
  return input.replace(/\s(\S{1,20})$/, '\u00A0$1');
}

export default removeWidow;
