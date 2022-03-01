const messages = {
  error: {
    /**
     * Used for 4xx error codes. Request has an error or requests invalid object.
     * @type {String}
     */
    request:
      'We couldn’t find what you were looking for. Try going back and having another go.',

    /**
     * Used for 5xx error codes. User might want to retry loading page.
     * @type {String}
     */
    server: 'Something went wrong. Refresh and we’ll try that again.',

    /**
     * Used to display a message when saving fails
     * @type {String}
     */
    save: 'A problem occured while saving. Please try again later.',

    /**
     * Used to display a message when saving a form fails
     * @type {String}
     */
    saveForm:
      'A problem occured while saving. Please fix the errors and try again.',

    /**
     * Used to display a message when deleting fails
     * @type {String}
     */
    delete: 'A problem occured while deleting. Please try again later.',

    /**
     * Used to display a message when sending an email for verification fails
     * @type {Object}
     */
    sendEmailVerification:
      'We were unable to send the verification email. Please try again.'
  },
  success: {
    /**
     * Used to display a message when saving succeeds
     * @type {Object}
     */
    save: {
      user: '“{{username}}” has been saved.',
      role: 'Changes have been saved.'
    },

    /**
     * Used to display a message when deleting succeeds
     * @type {Object}
     */
    create: {
      user: '“{{username}}” has been created.'
    },

    /**
     * Used to display a message when deleting succeeds
     * @type {Object}
     */
    delete: {
      user: '“{{username}}” has been deleted.'
    },

    /**
     * Used to display a message when sending a verification email
     * @type {Object}
     */
    sendEmailVerification:
      'A verification email has been sent to {{email}}. Please check your inbox.',

    /**
     * Used to display a message when email verification succeeds (Redirected)
     * @type {String}
     */
    emailVerified: 'Your email address has been successfully verified.'
  }
};

export default messages;
