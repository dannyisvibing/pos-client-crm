import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RBHeader = ({ classes, category, children }) => (
  <div
    className={classnames('vd-header', classes, {
      [`vd-header--${category}`]: category
    })}
  >
    {children}
  </div>
);

RBHeader.propTypes = {
  classes: PropTypes.string,
  category: PropTypes.oneOf([
    'page',
    'subpage',
    'section',
    'settings',
    'dialog'
  ])
};

RBHeader.defaultProps = {
  classes: '',
  category: 'section'
};

export default RBHeader;
