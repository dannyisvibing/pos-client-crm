import VendNumber from 'vend-number';
import STOCKTAKE_ITEM_STATUS from '../../../constants/stocktake/stocktake-item-status';
import StocktakeNumber from '../utils/stocktake-number';
const vn = VendNumber.vn;
const getBigNumberValue = StocktakeNumber.getBigNumberValue,
  getVendNumber = StocktakeNumber.getVendNumber;

export default class StocktakeItem {
  constructor(config) {
    config = config || {};
    this.stocktakeId = config.stocktakeId || null;

    if (config.expected) {
      config.count = config.expected;
    }

    if (config.counted) {
      config.received = config.counted;
    }

    this.name = config.name;
    this.sku = config.sku;
    this.expected = getVendNumber(config.count);
    this.counted = getVendNumber(config.received);
    this.countedUnsync = getVendNumber(config.countedUnsync);
    this.cost = getVendNumber(config.cost);
    this.productId = config.productId;
    this.id = this.stocktakeId + '_' + this.productId;
    this.selected = false;
    this.excluded = config.excluded || false;
    this.status = config.status;
    this.planned = config.isIncluded || config.planned;
    this.version = config.version;
    this.updateAt = config.updateAt ? new Date(config.updateAt) : null;
    this.createdAt = config.createdAt ? new Date(config.createdAt) : null;
    this.uploading = config.uploading;
  }

  resetUpdatedDate() {
    this.updatedAt = new Date();
  }

  /**
   * Sets the product data to a stocktake item given a product entity.
   * @param {Object} product
   */
  setProduct(product) {
    // To Do - Warning
    this.sku = product.sku;
    this.name = product.getName();
    this.productId = product.id;
  }

  isProcessed() {
    return this.status === 'stocktake_success';
  }

  revive() {
    this.counted = this.counted !== null ? vn(this.counted) : null;
    this.expected = this.expected !== null ? vn(this.expected) : null;
    this.countedUnsync =
      this.countedUnsync !== null ? vn(this.countedUnsync) : null;
    this.cost = this.cost !== null ? vn(this.cost) : null;
  }

  toJson() {
    return {
      stocktakeId: this.stocktakeId,
      productId: this.productId,
      id: this.id,
      sku: this.sku,
      name: this.name,
      excluded: this.excluded,
      planned: this.planned,
      updatedAt: this.updatedAt,
      counted: this.counted ? this.counted.toString() : null,
      expected: this.expected ? this.expected.toString() : null,
      countedUnsync: this.countedUnsync ? this.countedUnsync.toString() : null,
      cost: this.cost ? this.cost.toString() : null
    };
  }

  /**
   * Returns the sum of the synced and unsynced quantities. Returns null only if both quantities are.
   */
  getTotalCount() {
    var totalCount = null;

    if (this.counted !== null && this.countedUnsync !== null) {
      totalCount = this.counted.plus(this.countedUnsync);
    } else if (this.counted !== null) {
      totalCount = this.counted;
    } else if (this.countedUnsync !== null) {
      totalCount = this.countedUnsync;
    }

    return getBigNumberValue(totalCount);
  }

  /**
   * Resets the count to zero
   */
  resetCount() {
    var negativeCount = -this.getCounted();
    this.countedUnsync = vn(negativeCount);
    return negativeCount;
  }

  /**
   * Returns if a stocktakeItem has been counted
   */
  isCounted() {
    return this.getTotalCount() ? true : false;
  }

  /**
   * Returns if a stocktakeItem expected matches counted
   */
  isMatching() {
    var matching = false;

    if (this.isCounted()) {
      matching = this.getExpected() === this.getTotalCount();
    }

    return matching;
  }

  /**
   * Returns the status of the stocktake
   */
  getStatus() {
    var status;

    if (this.excluded) {
      status = STOCKTAKE_ITEM_STATUS.excluded;
    } else if (this.isCounted()) {
      status = this.isMatching()
        ? STOCKTAKE_ITEM_STATUS.matched
        : STOCKTAKE_ITEM_STATUS.unmatched;
    } else {
      status = STOCKTAKE_ITEM_STATUS.uncounted;
    }

    return status;
  }

  /**
   * Returns the status of the stocktake related to if its planned or not
   */
  getPlannedStatus() {
    var status;

    if (this.expected && this.planned) {
      status = STOCKTAKE_ITEM_STATUS.planned;
    } else if (this.expected) {
      status = STOCKTAKE_ITEM_STATUS.unplanned;
    } else {
      status = STOCKTAKE_ITEM_STATUS.unknown;
    }

    return status;
  }

  /**
   * Returns the numeric value to 5 dp of countedUnsynced
   */
  getCountedUnsync() {
    return getBigNumberValue(this.countedUnsync);
  }

  /**
   * Returns the numeric value to 5 dp of counted
   */
  getCounted() {
    return getBigNumberValue(this.counted);
  }

  /**
   * Returns if the item has been counted to zero
   */
  isZeroCounted() {
    return this.getCounted() === getBigNumberValue(vn(0));
  }

  /**
   * Returns the numeric `value to 5 dp of expected
   */
  getExpected() {
    return getBigNumberValue(this.expected);
  }

  /**
   * Returns whether a stocktakeItem needs to be pushed to the API, and locks it for syncing
   */
  setSyncing() {
    var countedUnsync = this.countedUnsync,
      counted = this.counted,
      requiresSyncing = false;

    if (countedUnsync && !this.uploading) {
      requiresSyncing =
        (!counted && countedUnsync.isZero()) || !countedUnsync.isZero();
    }

    this.uploading = Boolean(requiresSyncing);
    return requiresSyncing;
  }

  /**
   * Sets the stocktakeItem to no longer be uploading
   */
  unlockSyncing() {
    this.uploading = false;
  }

  /**
   * Adjusts the existing unsynced count by a number
   * @param {Number} adjustment
   */
  addCountUnsync(adjustment) {
    var countedUnsync = this.countedUnsync;

    if (countedUnsync) {
      this.countedUnsync = countedUnsync.plus(adjustment);
    } else {
      this.countedUnsync = vn(adjustment);
    }
  }

  /**
   * Sets the unsynced count to a specific number
   * @param {Number} quantity
   */
  setCountUnsynced(quantity) {
    this.countedUnsync = getVendNumber(quantity);
  }

  /**
   * Sets the synced count to a specific number
   * @param {Number} quantity
   */
  setCount(quantity) {
    this.counted = getVendNumber(quantity);
  }

  /**
   * Sets the expected count to a specific number
   * @param {Number} quantity
   */
  setExpected(quantity) {
    this.expected = getVendNumber(quantity);
  }

  /**
   * Calculates the difference in the expected count and received count
   */
  getDifferenceCount() {
    var counted = this.counted,
      expected = this.expected,
      differenceCount;

    if (!counted) {
      counted = vn(0);
    }

    differenceCount =
      counted && expected ? getBigNumberValue(counted.minus(expected)) : null;

    return differenceCount;
  }

  /**
   * Calculates the cost of difference
   */
  getDifferenceCost() {
    var cost = this.cost,
      differenceCount = this.getDifferenceCount(),
      differenceCost;

    differenceCost =
      cost && differenceCount
        ? getBigNumberValue(cost.times(differenceCount))
        : null;

    return differenceCost;
  }

  /**
   * Returns if the item has been counted and matches expected count
   */
  isCountedMatching() {
    var isUnplanned = this.isUnplanned();

    return (
      this.getStatus() === STOCKTAKE_ITEM_STATUS.matched &&
      !this.excluded &&
      !isUnplanned
    );
  }

  /**
   * Returns if the item is unplanned
   */
  isUnplanned() {
    return (
      this.getPlannedStatus() === STOCKTAKE_ITEM_STATUS.unplanned &&
      !this.excluded
    );
  }

  /**
   * Returns if the item has been excluded in the review page
   */
  isExcluded() {
    return this.excluded;
  }

  /**
   * Returns if if the item is pending to be synced to determine whether it's planned or not
   */
  isSyncing() {
    return (
      this.getPlannedStatus() === STOCKTAKE_ITEM_STATUS.unknown &&
      !this.excluded
    );
  }

  /**
   * Returns if the item has been counted but doesn't match expected count
   */
  isCountedNotMatching() {
    var isUnplanned = this.isUnplanned();

    return (
      this.getStatus() === STOCKTAKE_ITEM_STATUS.unmatched &&
      !this.excluded &&
      !isUnplanned
    );
  }

  computeValues() {
    this.preExpected = this.getExpected();
    this.preCounted = this.getTotalCount();
    this.preExpectedRaw = this.getExpected()
      ? parseFloat(this.getExpected())
      : -Number.MAX_SAFE_INTEGER;
    this.preCountedRaw = this.getTotalCount()
      ? parseFloat(this.getTotalCount())
      : -Number.MAX_SAFE_INTEGER;
    this.updatedTime = this.updatedAt ? this.updatedAt.getTime() : null;
    this.preDifferentCount = this.getDifferenceCount();
    this.preDifferenceCost = this.getDifferenceCost();
    this.preDifferentCountRaw = this.getDifferenceCount()
      ? parseFloat(this.getDifferenceCount())
      : -Number.MAX_SAFE_INTEGER;
    this.preDifferenceCostRaw = this.getDifferenceCost()
      ? parseFloat(this.getDifferenceCost())
      : -Number.MAX_SAFE_INTEGER;
    this.is = {
      countedMatching: this.isCountedMatching(),
      countedNotMatching: this.isCountedNotMatching(),
      processed: this.isProcessed(),
      unplanned: this.isUnplanned(),
      excluded: this.isExcluded(),
      syncing: this.isSyncing()
    };
  }
}
