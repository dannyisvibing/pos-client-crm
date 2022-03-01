import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import RBDialogClose from './RBDialogClose';

export const RBDialogHeader = ({ center, children }) => (
  <header
    className={classnames('vd-dialog-header', {
      'vd-dialog-header--center': center
    })}
  >
    {children}
  </header>
);

export const RBDialogHeaderMeta = ({ component, children }) =>
  component === 'div' ? (
    <div className="vd-dialog-header-meta">{children}</div>
  ) : component === 'ul' ? (
    <ul className="vd-dialog-header-meta">{children}</ul>
  ) : (
    undefined
  );

export const RBDialogHeaderDivider = () => (
  <hr className="vd-dialog-header-divider" />
);

export const RBDialogContent = ({ children }) => (
  <div className="vd-dialog-content">{children}</div>
);

export const RBDialogActions = ({ children }) => (
  <div className="vd-dialog-actions">{children}</div>
);

export const RBDialog = ({
  children,
  size,
  drawer,
  showClose = true,
  onRequestClose
}) => (
  <div className="">
    <div className="vd-overlay vd-overlay--visible" onClick={onRequestClose} />
    <div className="vd-dialog">
      <div
        className={classnames({
          'vd-dialog-container': !drawer,
          [`vd-dialog-container--size-${size}`]: !drawer && size,
          'vd-dialog-drawer-container': drawer
        })}
      >
        {showClose &&
          (drawer ? (
            <RBDialogClose modifier="drawer" onClick={onRequestClose} />
          ) : (
            <RBDialogClose onClick={onRequestClose} />
          ))}
        {children}
      </div>
    </div>
  </div>
);

class RBDialogBuilder extends Component {
  state = {
    open: false
  };

  componentWillReceiveProps(nextProps) {
    const nodeClassName = 'vd-modals-container';
    let MOUNT;
    if (nextProps.open) {
      const { size, drawer, showClose, children, onRequestClose } = nextProps;
      MOUNT = document.getElementsByClassName(nodeClassName)[0];
      if (!MOUNT) {
        var node = document.createElement('DIV');
        node.classList.add(nodeClassName);
        document.getElementById('root').appendChild(node);
        MOUNT = document.getElementsByClassName(nodeClassName)[0];
      }

      ReactDOM.render(
        <RBDialog
          size={size}
          drawer={drawer}
          showClose={showClose}
          onRequestClose={onRequestClose}
        >
          {children}
        </RBDialog>,
        MOUNT
      );
    } else if (this.props.open && !nextProps.open) {
      MOUNT = document.getElementsByClassName(nodeClassName)[0];
      ReactDOM.unmountComponentAtNode(MOUNT);
    }
  }

  render() {
    return <div />;
  }
}

RBDialogBuilder.propTypes = {
  open: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  onRequestClose: PropTypes.func
};

RBDialogBuilder.defaultProps = {
  size: 'small'
};

export default RBDialogBuilder;
