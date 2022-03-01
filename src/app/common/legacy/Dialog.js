import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

export const DialogHeader = ({ center, children }) => (
  <header
    className={classnames('vd-dialog-header', {
      'vd-dialog-header--center': center
    })}
  >
    {children}
  </header>
);

export const DialogHeaderMeta = ({ component, children }) =>
  component === 'div' ? (
    <div className="vd-dialog-header-meta">{children}</div>
  ) : component === 'ul' ? (
    <ul className="vd-dialog-header-meta">{children}</ul>
  ) : (
    undefined
  );

export const DialogHeaderDivider = () => (
  <hr className="vd-dialog-header-divider" />
);

export const DialogContent = ({ children }) => (
  <div className="vd-dialog-content">{children}</div>
);

export const DialogActions = ({ children }) => (
  <div className="vd-dialog-actions">{children}</div>
);

export const Dialog = ({ children, small, medium, large, onRequestClose }) => (
  <div className="">
    <div className="vd-overlay vd-overlay--visible" onClick={onRequestClose} />
    <div className="vd-dialog">
      <div
        className={classnames('vd-dialog-container', {
          'vd-dialog-container--size-large': large,
          'vd-dialog-container--size-medium': medium,
          'vd-dialog-container--size-small': small
        })}
      >
        <div className="vd-dialog-close">
          <a
            href=""
            className="vd-dialog-close-button"
            onClick={e => {
              e.preventDefault();
              onRequestClose();
            }}
          >
            <i className="fa fa-2x fa-times" />
            <span className="vd-dialog-close-label">ESC</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  </div>
);

class DialogBuilder extends Component {
  state = {
    open: false
  };

  componentWillReceiveProps(nextProps) {
    var nodeClassName = 'vd-modals-container';
    let MOUNT;
    if (nextProps.open) {
      const { large, small, medium, children, onRequestClose } = nextProps;
      MOUNT = document.getElementsByClassName(nodeClassName)[0];
      if (!MOUNT) {
        var node = document.createElement('DIV');
        node.classList.add(nodeClassName);
        document.getElementById('root').appendChild(node);
        MOUNT = document.getElementsByClassName(nodeClassName)[0];
      }

      ReactDOM.render(
        <Dialog
          large={large}
          medium={medium}
          small={small}
          onRequestClose={onRequestClose}
        >
          {children}
        </Dialog>,
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

export default DialogBuilder;
