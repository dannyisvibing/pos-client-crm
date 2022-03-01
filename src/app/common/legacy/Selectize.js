import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Selectize = ({
  label,
  options,
  short,
  value = options[0].value,
  classes,
  onChange
}) => (
  <div
    className={classnames('vd-field', classes, {
      'vd-field--short': short
    })}
  >
    {label && <div className="vd-label">{label}</div>}
    <div className="vd-value">
      <div className="vd-select-container">
        <select
          className="vd-select"
          value={value}
          onChange={event =>
            onChange
              ? onChange(
                  options.filter(
                    option => option.value === event.target.value
                  )[0]
                )
              : {}
          }
        >
          {options.map((option, i) => (
            <option key={i} label={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

Selectize.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default Selectize;
