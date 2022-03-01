import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RBCheckbox = ({
  classes,
  label,
  description,
  disabled,
  category,
  ...props
}) => (
  <div
    className={classnames('vd-checkbox', classes, {
      [`vd-checkbox--${category}`]: category,
      'vd-disabled': disabled
    })}
  >
    <label className="vd-checkbox-container">
      <div className="vd-checkbox-input-container">
        <input
          className="vd-checkbox-input"
          type="checkbox"
          disabled={disabled}
          checked={props.checked || false}
          {...props}
        />
        <div className="vd-checkbox-tick" />
        {label && <div className="vd-checkbox-label">{label}</div>}
      </div>
      {description && (
        <div className="vd-checkbox-description">{description}</div>
      )}
    </label>
  </div>
);

RBCheckbox.propTypes = {
  category: PropTypes.oneOf([
    'primary',
    'secondary',
    'negative',
    'tertiary',
    'info'
  ])
};

RBCheckbox.defaultProps = {
  category: 'primary'
};

export default RBCheckbox;
