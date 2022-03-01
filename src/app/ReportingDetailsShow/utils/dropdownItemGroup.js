import _ from 'lodash';

function dropdownItemGroupFilter(itemGroups, filter) {
  var filteredItemGroups;
  if (!filter) {
    return itemGroups;
  }
  filteredItemGroups = [];
  _.forEach(itemGroups, function(items, key) {
    var filteredItems;
    filteredItems = _.filter(items, function(item) {
      return item[filter.key] === filter.value;
    });
    if (filteredItems.length) {
      return filteredItemGroups.push(filteredItems);
    }
  });
  return filteredItemGroups;
}

export default dropdownItemGroupFilter;
