import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const RBRadio = ({
  classes,
  disabled,
  label,
  name,
  description,
  category,
  modifiers,
  ...props
}) => (
  <div
    className={classnames('vd-radio', classes, {
      [`vd-radio--${category}`]: category,
      'vd-radio--large': modifiers && modifiers.indexOf('large') > -1
    })}
  >
    <label className="vd-radio-container">
      <div className="vd-radio-input-container">
        <input className="vd-radio-input" name={name} type="radio" {...props} />
        <div className="vd-radio-tick" />
        {label && <div className="vd-radio-label">{label}</div>}
      </div>
      {description && <div className="vd-radio-description">{description}</div>}
    </label>
  </div>
);

RBRadio.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['large'])),
  category: PropTypes.oneOf(['primary', 'secondary', 'negative']),
  name: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string
};

RBRadio.defaultProps = {
  name: 'rb-radio',
  category: 'primary'
};

export default RBRadio;
