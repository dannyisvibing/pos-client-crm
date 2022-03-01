import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const RBFlag = ({ category, classes, children }) => (
  <div
    className={classnames('vd-flag', classes, {
      [`vd-flag--${category}`]: category
    })}
  >
    {category === 'negative' && <i className="fa fa-warning vd-mrs" />}
    {children}
  </div>
);

RBFlag.propTypes = {
  category: PropTypes.oneOf(['negative', 'warning'])
};

export default RBFlag;
