const applyFilters = (collection, ...args) => {
  var result = collection;
  args.map(filter => {
    result = filter.func(result, ...filter.args);
  });
  return result;
};

export default applyFilters;
