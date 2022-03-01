import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RBFlex from './RBFlex';

const RBBanner = ({
  classes,
  type,
  showBanner,
  showFeedback,
  feedback,
  children
}) => (
  <RBFlex
    flex
    flexJustify="between"
    flexAlign="stretch"
    classes={classnames('vd-banner', classes, {
      [`vd-banner--${type}`]: !!type
    })}
  >
    {showBanner && (
      <RBFlex classes="vd-banner-wrapper">
        {type === 'negative' && <i className="fa fa-warning fa-lg vd-mrm" />}
        <div className="vd-banner-content">{children}</div>
      </RBFlex>
    )}
    {showBanner &&
      showFeedback && <div className="vd-banner-feedback">{feedback}</div>}
  </RBFlex>
);

RBBanner.propTypes = {
  classes: PropTypes.string,
  type: PropTypes.oneOf([
    'info',
    'negative',
    'success',
    'warning',
    'activation'
  ]),
  showBanner: PropTypes.bool,
  showFeedback: PropTypes.bool,
  feedback: PropTypes.any
};

RBBanner.defaultProps = {
  type: 'info'
};

export default RBBanner;
