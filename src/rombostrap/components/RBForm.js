import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class RBForm extends Component {
  state = {
    valid: true,
    invalid: false,
    dirty: false,
    pristine: true,
    children: {}
  };

  onStateReset() {
    var initState = {
      valid: true,
      invalid: false,
      dirty: false,
      pristine: true,
      children: {}
    };

    this.setState(initState);
    this.props.onFormStateChanged(initState);
  }

  onStateChanged(name, newState) {
    var formState = this.state,
      valid = undefined,
      invalid = undefined,
      dirty = undefined,
      pristine = undefined;
    formState.children[name] = newState;

    _.forEach(formState.children, state => {
      valid = valid === undefined ? state.valid : valid && state.valid;
      invalid =
        invalid === undefined ? state.invalid : invalid || state.invalid;
      dirty = dirty === undefined ? state.dirty : dirty || state.dirty;
      pristine =
        pristine === undefined ? state.pristine : pristine && state.pristine;
    });

    formState.valid = valid;
    formState.invalid = invalid;
    formState.dirty = dirty;
    formState.pristine = pristine;
    this.props.onFormStateChanged(formState);
    this.setState({ ...formState });
  }

  render() {
    const { classes, children } = this.props;
    return <form className={classes}>{children}</form>;
  }
}

RBForm.propTypes = {
  onFormStateChanged: PropTypes.func
};

RBForm.defaultProps = {
  onFormStateChanged: () => {}
};

export default RBForm;
