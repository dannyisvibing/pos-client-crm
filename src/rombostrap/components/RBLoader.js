import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RBLoader = ({ type, classes }) => (
  <div
    className={classnames('vd-loader', classes, {
      [`vd-loader--${type}`]: !!type
    })}
  />
);

RBLoader.propTypes = {
  type: PropTypes.oneOf(['small', 'input'])
};

export default RBLoader;
