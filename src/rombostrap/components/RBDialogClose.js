import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const RBDialogClose = ({ modifier, classes, onClick }) => (
  <div
    className={classnames('vd-dialog-close', classes, {
      [`vd-dialog-close--${modifier}`]: modifier
    })}
  >
    <a
      className="vd-dialog-close-button"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      <i className="fa fa-times" />
      <span className="vd-dialog-close-label">ESC</span>
    </a>
  </div>
);

RBDialogClose.propTypes = {
  modifier: PropTypes.oneOf(['drawer'])
};

export default RBDialogClose;
