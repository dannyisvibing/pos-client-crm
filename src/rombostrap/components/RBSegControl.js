import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RBSegControl = ({
  classes,
  modifier,
  disabled,
  label,
  value,
  checked,
  onChange,
  children
}) =>
  modifier === 'panel' ? (
    <label
      className={classnames('vd-segcontrol vd-segcontrol--panel', classes)}
    >
      <input
        className="vd-segcontrol-input"
        name="radio"
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {!!label && (
        <div
          className={classnames('vd-button vd-button--panel', {
            'vd-button--stroke vd-button--primary': checked
          })}
        >
          {label}
        </div>
      )}
      {!label && (
        <div
          class={classnames('vd-button vd-button--panel', {
            'vd-button--stroke vd-button--primary': checked
          })}
        >
          {children}
        </div>
      )}
    </label>
  ) : (
    <label
      className={classnames('vd-segcontrol', classes, {
        'vd-segcontrol--selected': checked,
        'vd-segcontrol--disabled': disabled
      })}
    >
      <input
        className="vd-segcontrol-input"
        name="radio"
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {!label && <div className="vd-segcontrol-button">{children}</div>}
      {!!label && <div className="vd-segcontrol-button">{label}</div>}
    </label>
  );

RBSegControl.propTypes = {
  modifier: PropTypes.oneOf(['panel'])
};

export default RBSegControl;
