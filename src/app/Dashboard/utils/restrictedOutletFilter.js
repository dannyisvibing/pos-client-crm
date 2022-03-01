import _ from 'lodash';

function filterRestrictedOutlet(
  collection,
  restrictedOutletIds,
  outletIdAccessor = 'id'
) {
  if (restrictedOutletIds && restrictedOutletIds.length) {
    return _.filter(
      collection,
      entity => restrictedOutletIds.indexOf(entity[outletIdAccessor]) > -1
    );
  }
  return collection;
}

export default filterRestrictedOutlet;
