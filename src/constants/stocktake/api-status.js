const STATUS = {
  /**
   * When a stocktake has been created
   */
  stocktake: 'stocktake_scheduled',

  /**
   * Stocktake created in previous Inventory System
   */
  oldStocktake: 'stocktake',

  /**
   * When a stocktake has been started
   */
  inProgress: 'stocktake_in_progress',

  /**
   * When a stocktake has been started and processed by background job
   */
  inProgressProcessed: 'stocktake_in_progress_processed',

  /**
   * When stocktake has been completed
   */
  completed: 'stocktake_complete',

  /**
   * When a stocktake has been deleted
   */
  cancelled: 'canceled'
};

export default STATUS;
