import React from 'react';
import removeWidow from '../../../utils/removeWidow';

const ErrorMessage = () => (
  <div class="ds-error-message vd-text--negative">
    <i className="fa fa-warning vd-mrm" />
    <span>
      {removeWidow(
        'Sorry, we were unable to fetch some data. Please refresh to try again.'
      )}
    </span>
  </div>
);

export default ErrorMessage;
