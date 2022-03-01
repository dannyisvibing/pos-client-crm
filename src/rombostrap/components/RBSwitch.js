import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RBSwitch = ({ classes, modifiers, ...props }) => {
  return (
    <div
      className={classnames(
        'vd-switch',
        classes,
        modifiers.map(modifier => `vd-switch--${modifier}`).join(' ')
      )}
    >
      <input className="vd-switch-input" type="checkbox" {...props} />
      <div className="vd-switch-track">
        <i className="vd-switch-icon fa fa-check" />
        <div className="vd-switch-track-knob" />
      </div>
    </div>
  );
};

RBSwitch.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['small']))
};

RBSwitch.defaultProps = {
  modifiers: []
};

export default RBSwitch;
