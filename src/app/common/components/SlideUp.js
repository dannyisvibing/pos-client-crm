import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SlideUp extends Component {
  state = {
    state: 'initial'
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      this.handleEnter(nextProps);
    } else if (!nextProps.open && this.props.open) {
      this.handleExit();
    }
  }

  handleEnter(props) {
    if (props.onEnter) props.onEnter();
    const { id } = props;
    document.getElementById(`${id}-wrapper`).style.display = 'flex';
    this.handleEntering(props);
  }

  handleEntering(props) {
    const { id, fullScreen, maxWidth, enterTransitionDuration } = props;
    setTimeout(() => {
      if (props.onEntering) props.onEntering();
      if (fullScreen) {
        document.getElementById(`${id}-container`).style.width = '100%';
        document.getElementById(`${id}-container`).style.height = '100%';
      }

      if (maxWidth) {
        document.getElementById(`${id}-container`).style.maxWidth =
          maxWidth + 'px';
        document.getElementById(`${id}-container`).style.padding = '20px 0px';
      }

      document.getElementById(
        `${id}-container`
      ).style.transition = `all ${enterTransitionDuration}s ease-out`;
      document.getElementById(`${id}-container`).style.top = '0%';

      setTimeout(() => {
        this.handleEntered();
      }, enterTransitionDuration * 1000);
    }, 0);
  }

  handleEntered() {
    if (this.props.onEntered) this.props.onEntered();
  }

  handleExit() {
    if (this.props.onExit) this.props.onExit();
    this.handleExiting();
  }

  handleExiting() {
    const { id, leaveTransitionDuration } = this.props;
    document.getElementById(`${id}-container`).style.top = '100%';
    document.getElementById(
      `${id}-container`
    ).style.transition = `all ${leaveTransitionDuration}s ease-out`;
    if (this.props.onExiting) this.props.onExiting();
    setTimeout(() => {
      this.handleExited();
    }, leaveTransitionDuration * 1000);
  }

  handleExited() {
    const { id } = this.props;
    document.getElementById(`${id}-wrapper`).style.display = 'none';
    if (this.props.onExited) this.props.onExited();
  }

  handleClickBackdrop = event => {
    if (event.target.id === `${this.props.id}-wrapper`) {
      if (!this.props.ignoreBackdropClick) {
        this.props.onRequestClose();
      }
    }
  };

  render() {
    const { id, children } = this.props;

    return (
      <div
        id={`${id}-wrapper`}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          background: 'transparent',
          height: '100%',
          width: '100%',
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={this.handleClickBackdrop}
      >
        <div
          id={`${id}-container`}
          style={{
            position: 'relative',
            background: 'transparent',
            top: '100%',
            transition: 'all .3s ease-out'
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

SlideUp.propTypes = {
  id: PropTypes.string,
  enterTransitionDuration: PropTypes.number,
  leaveTransitionDuration: PropTypes.number,
  ignoreBackdropClick: PropTypes.bool,
  fullScreen: PropTypes.bool,
  maxWidth: PropTypes.number,
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func
};

SlideUp.defaultProps = {
  id: 'default-slideup',
  enterTransitionDuration: 0.3,
  leaveTransitionDuration: 0.3,
  ignoreBackdropClick: false
};

export default SlideUp;
