const REVIEW_TAB_HEADINGS = {
  /**
   * When stocktakeItem.counted === null
   */
  uncounted:
    'Nothing has been counted for the items in this list. <strong>These items inventory will be reset to 0, unless you choose to exclude them.</strong>',

  /**
   * When given a stocktakeItem, counted === expected
   */
  matched: 'Great work! The count for these matched perfectly',

  /**
   * When given a stocktakeItem, counted !== expected
   */
  unmatched:
    'The amount you counted was more or less than expected. You might like to double-check items in this list',

  /**
   * When a stocktake item has been excluded by the user in the review page
   */
  excluded:
    "You've chosen to leave these items out of your count. The totals for these will not be updated"
};

export default REVIEW_TAB_HEADINGS;
