import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RBTabs = ({ classes, modifiers, activeValue, onClick, children }) => {
  var rbModifiers = [];
  if (modifiers) {
    rbModifiers = modifiers.map(modifier => `vd-tabs--${modifier}`);
  }
  const expandedProps = { activeValue, onClick };
  return (
    <div
      className={classnames('vd-tabs', classes, (rbModifiers || []).join(' '))}
    >
      {React.Children.map(
        children,
        child =>
          !!child &&
          (child.type.displayName === 'rb-tab'
            ? React.cloneElement(child, expandedProps)
            : child)
      )}
    </div>
  );
};

RBTabs.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(['no-border', 'large']))
};

RBTabs.defaultProps = {
  modifier: []
};

export default RBTabs;
