function Enum(...values) {
  if (!(this instanceof Enum)) {
    return new Enum(...values);
  }

  this.values = values;

  // Save each value on the instance
  values.forEach(value => {
    this[value] = value;
  });
}

/**
 * Determine if an enum has a value
 *
 * @param {string} value The value to test
 *
 * @return {boolean} True if the enum contains the value
 */
Enum.prototype.has = function(value) {
  return this.values.indexOf(value) !== -1;
};

/**
 * Test if an enum constains a value and throw an error if it doesn't.
 *
 * @param {string} value The value to test
 */
Enum.prototype.test = function(value) {
  if (!this.has(value)) {
    throw new Error(`Enum value ${value} invalid.`);
  }
};

export default Enum;
