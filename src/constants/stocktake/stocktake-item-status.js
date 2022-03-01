const STOCKTAKE_ITEM_STATUS = {
  /**
   * When stocktakeItem.counted !=== null
   */
  counted: 'counted',

  /**
   * When stocktakeItem.counted === null
   */
  uncounted: 'uncounted',

  /**
   * When given a stocktakeItem, counted === expected
   */
  matched: 'matched',

  /**
   * When given a stocktakeItem, counted !== expected
   */
  unmatched: 'unmatched',

  /**
   * When a stocktake item was not initially planned for this stocktake (matches filters)
   */
  unplanned: 'unplanned',

  /**
   * When a stocktake item has been excluded by the user in the review page.
   */
  excluded: 'excluded',

  /**
   * When a stocktake item was initially planned for this stocktake
   */
  planned: 'planned',

  /**
   * When it is not known if it's a planned item since it requires to check with the server
   */
  unknown: 'unknown',

  /**
   * Any stocktakeItem, used for 'all' filtering
   */
  any: 'any'
};

export default STOCKTAKE_ITEM_STATUS;
