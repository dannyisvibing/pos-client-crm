import React from 'react';

const RBPasswordCheckerFeedback = ({ score }) => (
  <div>
    <div className="up-password-meter">
      <div className="up-password-meter-bar" data-value={score.meterValue}>
        {' '}
      </div>
    </div>
    {score.meterValue && (
      <div>
        {score.result.feedback.warning && (
          <div className="vd-text--secondary">
            {score.result.feedback.warning}.
          </div>
        )}
      </div>
    )}
  </div>
);

export default RBPasswordCheckerFeedback;
