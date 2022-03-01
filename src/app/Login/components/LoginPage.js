import React from 'react';
import PropTypes from 'prop-types';

const { func, object, bool } = PropTypes;
LoginPage.propTypes = {
  values: object.isRequired,
  touched: object.isRequired,
  errors: object.isRequired,
  isValid: bool,
  isSubmitting: bool,
  handleSubmit: func.isRequired,
  handleChange: func.isRequired,
  handleBlur: func.isRequired
};

export default function LoginPage(props) {
  const { values, errors } = props;
  return (
    <form onSubmit={props.handleSubmit}>
      <input
        placeholder="Enter your email or username"
        name="username"
        value={values.username}
        onChange={props.handleChange}
        onBlur={props.handleBlur}
      />
      <input
        placeholder="Enter your password"
        type="password"
        name="password"
        value={values.password}
        onChange={props.handleChange}
        onBlur={props.handleBlur}
      />
      {errors.common && <span>{errors.common}</span>}
      <button disabled={!props.isValid || props.isSubmitting}>Login</button>
    </form>
  );
}
