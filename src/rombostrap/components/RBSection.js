import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const RBSectionActionBar = ({ type, children }) => (
  <div className={`vd-section--action-bar-${type}`}>{children}</div>
);

const RBSection = ({ classes, type, level, children }) => (
  <div
    className={classnames('vd-section', classes, {
      [`vd-section--${type}`]: !!type,
      [`vd-section--level-${level}`]: !!level
    })}
  >
    <div className="vd-section-wrap">{children}</div>
  </div>
);

RBSection.propTypes = {
  type: PropTypes.oneOf([
    'secondary',
    'tertiary',
    'panel',
    'fixed',
    'action-bar',
    'action-bar-about',
    'action-bar-actions'
  ]),
  level: PropTypes.oneOf([2])
};

export default RBSection;
