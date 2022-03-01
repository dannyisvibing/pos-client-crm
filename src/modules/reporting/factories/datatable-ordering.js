var __bind = function(fn, me) {
  return function() {
    return fn.apply(me, arguments);
  };
};

export default class DatatableOrder {
  constructor(directionClasses) {
    this.directionClasses = directionClasses;
    this.orderByDimension = __bind(this.orderByDimension, this);
    this.orderByAggregate = __bind(this.orderByAggregate, this);
  }

  orderByAggregate(orderRules, key) {
    var orderRule, _i, _len, _results;
    if (key === orderRules[0].metric) {
      this._toggleDirection(orderRules);
    }
    _results = [];
    for (_i = 0, _len = orderRules.length; _i < _len; _i++) {
      orderRule = orderRules[_i];
      _results.push(orderRule.setMetric(key));
    }
    return _results;
  }

  orderByDimension(orderRules) {
    if (orderRules[0].alphabetical === true) {
      this._toggleDirection(orderRules);
    } else {
      this._setDirection(orderRules, 'asc');
    }
    return orderRules[0].setAlphabetical();
  }

  getAggregateHeaderClass(orderRule, key) {
    if (orderRule.metric === key) {
      return this._directionClass(orderRule.direction);
    }
  }

  getDimensionHeaderClass(orderRule, key) {
    if (orderRule.alphabetical === true && orderRule.dimension === key) {
      return this._directionClass(orderRule.direction);
    }
  }

  _directionClass(direction) {
    return this.directionClasses[direction] || '';
  }

  _toggleDirection(orderRules) {
    if (orderRules[0].direction === 'asc') {
      return this._setDirection(orderRules, 'desc');
    } else {
      return this._setDirection(orderRules, 'asc');
    }
  }

  _setDirection(orderRules, direction) {
    var orderRule, _i, _len, _results;
    if (direction !== 'asc' && direction !== 'desc') return;
    _results = [];
    for (_i = 0, _len = orderRules.length; _i < _len; _i++) {
      orderRule = orderRules[_i];
      _results.push((orderRule.direction = direction));
    }
    return _results;
  }
}
