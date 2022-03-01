import _ from 'lodash';

export default function(outlets, outletIds, maxOutlets) {
  let outletNameIds = [];
  let andMore = '';
  let difference = 0;

  if (!outletIds.length) {
    return 'All Outlets';
  }

  outletNameIds = maxOutlets > 0 ? _.take(outletIds, maxOutlets) : outletIds;

  difference = outletIds.length - outletNameIds.length;

  if (difference > 0) {
    andMore = ` and ${difference} more`;
  }

  return (
    _.map(outletNameIds, outletId => {
      const outlet = _.find(outlets, { outletId }) || {};
      return outlet.outletName || '';
    }).join(', ') + andMore
  );
}
