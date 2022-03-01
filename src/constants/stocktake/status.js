const STATUS = {
  /**
   * When stocktakeDueDate = today, and has not started
   */
  due: 'due',

  /**
   * When stocktakeDueDate < today, and has not started
   */
  overdue: 'overdue',

  /**
   * When stocktake has been started
   */
  inProgress: 'in-progress',

  /**
   * When stocktake has been started and processed by background job
   */
  inProgressProcessed: 'in-progress-processed',

  /**
   * When stocktake was created in the old system and hasn't been completed/abandoned.
   */
  oldStocktake: 'old-stocktake',

  /**
   * When stocktakeDueDate > today, and has not started
   */
  upcoming: 'upcoming',

  /**
   * When a stocktake has been marked as completed
   */
  completed: 'completed',

  /**
   * When a stocktake has been marked as cancelled
   */
  cancelled: 'cancelled'
};

export default STATUS;
