const states = {
  /**
   * Used when a page is ready to interact with.
   */
  ready: 'ready',

  /**
   * Used when a page currently in-progress with something (i.e. waiting for a response from an ajax request)
   */
  inProgress: 'in-progress',

  /**
   * Used when the next page of a list of entities is being fetched
   */
  nextPage: 'next-page',

  /**
   * Used when a request is successful, but there are no results in the payload.
   */
  noResults: 'no-results',

  /**
   * User for 5xx error codes. User might want to re-try loading page.
   */
  error: 'error',

  /**
   * Used when a dangerous action has been caused or prevented
   */
  danger: 'danger',

  /**
   * Used when an action was successful.
   */
  success: 'success',

  /**
   * Used when a non-recommended action has been taken.
   */
  warning: 'warning',

  /**
   * Used when a primary action has been taken performed
   */
  primary: 'primary',

  /**
   * Used with a notification, indicating the notification has an action associated with it, and is not self-dismissing.
   */
  action: 'action',

  /**
   * Used for 4xx error codes. Request has an error or requests invalid object.
   */
  requestError: 'request-error'
};

export default states;
