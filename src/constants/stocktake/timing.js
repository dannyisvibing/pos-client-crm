const TIMINGS = {
  deleteDelay: 50,

  /**
   * Waiting time between updating and validating input model
   */
  validateDelay: 500,

  /**
   * Time to wait for trying to resave the counts in the perform page
   */
  retrySave: 500,

  /**
   * Time to wait for getting products from IDB in large listings to accumulate requests and perform one bigger batch operation
   */
  delayTransaction: 100,

  /**
   * Frequency for polling consignment status in the review page
   */
  reviewPolling: 10000,

  /**
   * Frequency for polling consignment status in the perform page
   */
  performPolling: 60000,

  /**
   * Frequency for checking for new counts in perform/review page
   */
  itemsPolling: 5000,

  /**
   * Frequency for checking if report download url is available
   */
  reportPolling: 1000,

  /**
   * Frequency for autosave on perform page
   */
  autoSave: 5000
};

export default TIMINGS;
