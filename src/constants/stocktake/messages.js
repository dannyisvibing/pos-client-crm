const MESSAGES = {
  landing: {
    reset: {
      /**
       * Title for the confirmation modal
       */
      modalTitle: 'Resync data?',

      /**
       * Content for the confirmation modal
       */
      modalText: 'This will resync your data. Press “Resync data” to continue',

      /**
       * Text for the submit button
       */
      modalAction: 'Resync data'
    }
  },

  /**
   * List of messages used on create page
   */
  create: {
    /**
     * Create Success
     */
    success: '“{{name}}” count created.',

    /**
     * Create Error
     */
    error: 'There was a problem creating the inventory count, please try again.'
  },

  /**
   * List of messages used on edit page
   */
  edit: {
    /**
     * Edit Success
     */
    success: '“{{name}}” updated.',

    /**
     * Edit Error
     */
    error: 'There was a problem creating the inventory count. Please try again.'
  },

  /**
   * List of messages used when stocktake deleted
   */
  delete: {
    /**
     * Delete Success
     */
    success: 'Your Inventory Count has been deleted.',

    /**
     * Delete Successes
     */
    successes: 'Your Inventory Counts have been deleted.',

    /**
     * Delete Error
     */
    error:
      'Was unsuccessful deleting {{count}} Inventory Count(s). Please try again.'
  },

  /**
   * List of messages used in perform page
   */
  perform: {
    /**
     * Message displayed while the 'start' job is running
     */
    startJob:
      "Loading your products. Some items may appear in red until we finish. Don't worry - keep counting!"
  },

  /**
   * List of messages used in view page
   */
  view: {
    /**
     * List of messages used on abandoning a stocktake
     */
    abandon: {
      /**
       * Abandon success
       */
      success: '“{{name}}” count has been abandoned.',

      /**
       * Abandon error
       */
      error:
        'There was a problem abandoning this Inventory Count. Please try again.',

      /**
       * Title for the confirmation modal
       */
      modalTitle: 'Are you sure you want to abandon count?',

      /**
       * Content for the confirmation modal
       */
      modalText:
        'Your inventory levels will not be updated. A record of this inventory will be saved but ' +
        'you will no longer be able to edit it.',

      /**
       * Text for the submit button
       */
      modalAction: 'Abandon'
    },

    /**
     * List of messages used when recounting items
     */
    recountItems: {
      /**
       * Recount error
       */
      error: {
        singular: 'There was a problem recounting the item. Please try again.',
        plural: 'There was a problem recounting the items. Please try again.'
      },

      /**
       * Recount success
       */
      success: {
        singular: 'Count reset for 1 item. You can recount now.',
        plural: 'Count reset for {{itemNumber}} items. You can recount now.'
      },

      /**
       * Title for the confirmation modal
       */
      modalTitle: {
        singular: 'Reset item count?',
        plural: 'Reset items count?'
      },

      /**
       * Title for the confirmation modal
       */
      modalAction: 'Reset Count',

      /**
       * Content for the confirmation modal
       */
      modalText: {
        singular:
          'The count for 1 item will be reset to zero. Click Resume Count to count it again.',
        plural:
          'The count for {{itemNumber}} items will be reset to zero. Click Resume Count to count ' +
          'them again.'
      }
    },

    /**
     * List of messages used on excluding items
     */
    excludeItems: {
      error:
        'There was a problem excluding some of the items. Please try again.'
    },

    /**
     * List of messages used on completing a stocktake
     */
    complete: {
      /**
       * Complete success
       */
      success: '“{{name}}” has been completed.',

      /**
       * Complete error
       */
      error:
        'There was a problem completing this Inventory Count. Please try again.',

      /**
       * Title for the confirmation modal
       */
      modalTitle: 'Complete Stocktake',

      /**
       * Content for the confirmation modal
       */
      modalText: {
        /**
         * Modal text to display when there are uncounted items
         */
        warning: {
          singular:
            'We will reset the inventory count for this item to zero, or you can choose to ' +
            'exclude this item from the count on the review page. We will begin updating your ' +
            'inventory levels when you click submit.',
          plural:
            'We will reset the inventory count for these items to zero, or you can choose to ' +
            'exclude these items from the count on the review page. We will begin updating your ' +
            'inventory levels when you click submit.'
        },

        /**
         * Modal text to display when all items have been counted
         */
        success:
          "Awesome! You've finished counting. When you click submit, we'll begin updating your " +
          'inventory levels.'
      },

      /**
       * Content for the alert text in the complete modal
       */
      modalAlert: {
        singular: 'There is 1 uncounted item in this inventory count.',
        plural:
          'There are {{uncountedItems}} uncounted items in this inventory count.'
      },

      /**
       * Text for the submit button
       */
      modalAction: 'Submit'
    },

    /**
     * List of messages used when generating/accessign a stocktake report
     */
    reports: {
      /**
       * Report error
       */
      error: 'There was a problem generating your report. Please try again.'
    }
  }
};

export default MESSAGES;
