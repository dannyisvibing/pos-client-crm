function splitNumber(num, key, seperator) {
  if (num == null) {
    num = 0;
  }
  if (seperator == null) {
    seperator = '.';
  }
  num = num.toString();
  if (num === '') {
    return '';
  }
  if (num.indexOf(seperator) < 0) {
    return num;
  }
  num = num.split('.');
  switch (key) {
    case 'inventory_count':
    case 'inventory_reorder_point':
    case 'inventory_reorder_amount':
    case 'basket_size':
    case 'weeks_cover':
    case 'item_count':
    case 'item_count_monthly':
    case 'recent_item_count':
    case 'return_count':
      if (num[1] <= 0) {
        return (
          '' +
          num[0] +
          "<span class='decimals--invisible'>" +
          seperator +
          num[1] +
          '</span>'
        );
      } else {
        return (
          '' +
          num[0] +
          "<span class='decimals'>" +
          seperator +
          num[1] +
          '</span>'
        );
      }

    default:
      return (
        '' + num[0] + "<span class='decimals'>" + seperator + num[1] + '</span>'
      );
  }
}

export default splitNumber;
