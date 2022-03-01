var __indexOf =
  [].indexOf ||
  function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }
    return -1;
  };

const VALID_DIRECTIONS = ['asc', 'desc'];

const INVALID_DIRECTION_ERROR = new Error(
  'Order rule must have a valid direction'
);

const NO_METRIC_OR_ALPHABETICAL_ERROR = new Error(
  'Order rule must be alphabetical or for a metric'
);

export default class OrderRule {
  constructor(attrs) {
    this.dimension = attrs.dimension;
    this.direction = attrs.direction;
    this.metric = attrs.metric;
    this.alphabetical = attrs.alphabetical;
    this.valid();
  }

  valid() {
    var _ref;
    if (((_ref = this.direction), __indexOf.call(VALID_DIRECTIONS, _ref) < 0)) {
      throw INVALID_DIRECTION_ERROR;
    }

    if (!this.metric && !this.alphabetical) {
      throw NO_METRIC_OR_ALPHABETICAL_ERROR;
    }

    return true;
  }

  setMetric(key) {
    this.alphabetical = false;
    return (this.metric = key);
  }

  setAlphabetical() {
    this.metric = void 0;
    return (this.alphabetical = true);
  }
}
