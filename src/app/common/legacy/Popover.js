import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export class PopoverTarget extends Component {
  state = {};
  render() {
    const {
      abuttedLeft,
      pinnedRight,
      targetLeft,
      // targetRight,
      targetTop,
      targetBottom,
      targetMiddle,
      containerLeft,
      containerRight,
      containerTop,
      containerBottom,
      containerMiddle,
      tetherEnable,
      classes,
      children
    } = this.props;

    return (
      <div
        className={classnames(
          classes,
          'vd-popover-tether-target vd-popover-tether-element-attached-left vd-popover-tether-target-attached-left',
          {
            'vd-popover-tether-abutted vd-popover-tether-abutted-left': abuttedLeft,
            'vd-popover-tether-pinned vd-popover-tether-pinned-right': pinnedRight,
            'vd-popover-tether-target-attached-bottom': targetBottom,
            'vd-popover-tether-target-attached-top': targetTop,
            'vd-popover-tether-target-attached-left': targetLeft,
            'vd-popover-tether-target-attached-right': targetTop,
            'vd-popover-tether-target-attached-middle': targetMiddle,
            'vd-popover-tether-element-attached-top': containerTop,
            'vd-popover-tether-element-attached-bottom': containerBottom,
            'vd-popover-tether-element-attached-right': containerRight,
            'vd-popover-tether-element-attached-left': containerLeft,
            'vd-popover-tether-element-attached-middle': containerMiddle,
            'vd-popover-tether-enabled': tetherEnable
          }
        )}
      >
        {children}
      </div>
    );
  }
}

export class PopoverContainer extends Component {
  state = {};

  render() {
    const {
      classes,
      abuttedLeft,
      pinnedRight,
      targetLeft,
      targetRight,
      targetTop,
      targetBottom,
      targetMiddle,
      containerLeft,
      containerRight,
      containerTop,
      containerBottom,
      containerMiddle,
      tetherEnable,
      list,
      showBeak = true,
      width,
      style,
      hidePrint,
      children
      // ...props
    } = this.props;

    return (
      <div
        className={classnames(
          classes,
          'vd-popover-tether-element vd-popover-container vd-popover-tether-element-attached-left vd-popover-tether-target-attached-left',
          {
            'vd-popover--list vd-popover--with-list': list,
            'vd-hide-print': hidePrint,
            'vd-popover-tether-abutted vd-popover-tether-abutted-left': abuttedLeft,
            'vd-popover-tether-pinned vd-popover-tether-pinned-right': pinnedRight,
            'vd-popover-tether-target-attached-bottom': targetBottom,
            'vd-popover-tether-target-attached-top': targetTop,
            'vd-popover-tether-target-attached-left': targetLeft,
            'vd-popover-tether-target-attached-right': targetTop,
            'vd-popover-tether-target-attached-middle': targetMiddle,
            'vd-popover-tether-element-attached-top': containerTop,
            'vd-popover-tether-element-attached-bottom': containerBottom,
            'vd-popover-tether-element-attached-right': containerRight,
            'vd-popover-tether-element-attached-left': containerLeft,
            'vd-popover-tether-element-attached-middle': containerMiddle,
            'vd-popover-tether-enabled': tetherEnable
          }
        )}
        style={style}
      >
        <div className="vd-popover">
          {children}
          {showBeak && <div className="vd-popover-beak" />}
        </div>
      </div>
    );
  }
}

export const PopoverContent = ({ classes, children }) => (
  <div className={classnames('vd-popover-content', classes)}>{children}</div>
);

export const PopoverList = ({ children }) => (
  <ol className="vd-popover-list">{children}</ol>
);

export const PopoverListHeader = ({ children }) => (
  <li className="vd-popover-list-header">{children}</li>
);

export const PopoverListGroup = ({ children }) => (
  <li className="vd-popover-list-group">{children}</li>
);

export const PopoverListItem = ({ active, children }) => (
  <a
    className={classnames('vd-popover-list-item', {
      'vd-popover-list-item--active': active
    })}
    href=""
  >
    {children}
  </a>
);

export const PopoverActions = ({ children }) => (
  <div className="vd-popover-actions">{children}</div>
);

const TARGET_REF_NAME = 'target';
const CONTAINER_REF_NAME = 'container';
const POPOVER_PADDING = 30;

class Popover extends Component {
  state = {};
  componentDidMount() {
    this.eventListener = event => {
      if (this.props.open) {
        if ((event.target.className || '').search('vd-overlay') !== -1) {
          this.props.onRequestClose();
        }
      }
    };

    window.addEventListener('click', this.eventListener);
  }

  componentWillReceiveProps(nextProps) {
    var nodeClassName = `vd-${nextProps.id}-container`;
    if (nextProps.open) {
      var MOUNT = document.getElementsByClassName(nodeClassName)[0];
      if (!MOUNT) {
        var node = document.createElement('DIV');
        node.classList.add(nodeClassName);
        document.getElementById('root').appendChild(node);
        MOUNT = document.getElementsByClassName(nodeClassName)[0];
      }

      var OVERLAY = document.getElementById('popover-overlay');
      if (!OVERLAY) {
        OVERLAY = document.createElement('DIV');
        OVERLAY.id = 'popover-overlay';
        OVERLAY.className = 'vd-overlay';
        OVERLAY.style.visibility = 'visible';
        OVERLAY.style.pointerEvents = 'unset';
        document.getElementById('root').insertBefore(OVERLAY, MOUNT);
      }

      const { children, open, ...parentProps } = nextProps;
      const expandedProps = { tetherEnable: true, ...parentProps };

      ReactDOM.render(
        React.cloneElement(React.Children.toArray(children)[1], expandedProps),
        MOUNT
      );
    } else if (this.props.open && !nextProps.open) {
      var MOUNT = document.getElementsByClassName(nodeClassName)[0];
      if (MOUNT) {
        ReactDOM.unmountComponentAtNode(MOUNT);
      }

      MOUNT = document.getElementById('popover-overlay');
      if (MOUNT) {
        document.getElementById('root').removeChild(MOUNT);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open) {
      var node = document.getElementsByClassName(
        `vd-${this.props.id}-container`
      )[0];
      (node.style.left = 0),
        (node.style.top = 0),
        (node.style.position = 'absolute');

      const rectTarget = ReactDOM.findDOMNode(
        this.refs[TARGET_REF_NAME]
      ).getBoundingClientRect();
      const rectContainer = node.getBoundingClientRect();
      const {
        targetTop,
        targetBottom,
        targetMiddle,
        targetLeft,
        targetRight,
        containerTop,
        containerBottom,
        containerLeft,
        containerRight,
        containerMiddle,
        flow
      } = this.props;

      var translateX, translateY;
      if (targetBottom && containerTop) {
        if (!flow) {
          node.childNodes[0].style.width = `${rectTarget.width}px`;
        }

        (translateX = rectTarget.left), (translateY = rectTarget.bottom);
        if (
          translateX + node.clientWidth >
          window.innerWidth - POPOVER_PADDING
        ) {
          translateX = window.innerWidth - node.clientWidth - POPOVER_PADDING;
        }

        if (
          translateY + node.clientHeight >
          window.innerHeight - POPOVER_PADDING
        ) {
          translateY = window.innerHeight - node.clientHeight - POPOVER_PADDING;
        }
      } else if (
        targetMiddle &&
        targetLeft &&
        containerMiddle &&
        containerRight
      ) {
        translateX = rectTarget.left - rectContainer.width;
        translateY =
          (rectTarget.top + rectTarget.bottom) / 2 - rectContainer.height / 2;
      }

      node.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(0px)`;
      node.style.zIndex = 5;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.eventListener);
  }

  render() {
    const { children, open, ...parentProps } = this.props;
    const expandedProps = {
      ref: TARGET_REF_NAME,
      tetherEnable: open,
      ...parentProps
    };

    return React.cloneElement(
      React.Children.toArray(children)[0],
      expandedProps
    );
  }
}

Popover.propTypes = {
  id: PropTypes.string,
  abuttedLeft: PropTypes.bool,
  pinnedRight: PropTypes.bool,
  targetLeft: PropTypes.bool,
  targetRight: PropTypes.bool,
  targetTop: PropTypes.bool,
  targetBottom: PropTypes.bool,
  targetMiddle: PropTypes.bool,
  containerLeft: PropTypes.bool,
  containerRight: PropTypes.bool,
  containerTop: PropTypes.bool,
  containerBottom: PropTypes.bool,
  containerMiddle: PropTypes.bool,
  flow: PropTypes.bool
};

Popover.defaultProps = {
  id: 'default-popover'
};

export default Popover;
