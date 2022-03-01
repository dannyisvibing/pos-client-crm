import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import RBNumber from './Behavior/RBNumber';
import rbPasswordChecker from './Behavior/RBPasswordChecker';
import RBInputSymbol from './RBInputSymbol';

export const RBInputErrorMessageSection = ({ children }) => (
  <div className="vd-input-error-message-section">
    <i className="fa fa-exclamation-triangle" />
    <span className="vd-input-error-message-text">{children}</span>
  </div>
);

class RBInput extends Component {
  state = {
    hasFocus: false
  };

  componentDidMount() {
    const { rbNumberEnabled, rbNumberOptions, rbInputSymbol } = this.props;
    if (rbNumberEnabled) {
      this._rbNumber = new RBNumber();
      this._rbNumber.link(this.input, rbNumberOptions);
    }

    if (rbInputSymbol) {
      this._rbInputSymbol = new RBInputSymbol();
      this._rbInputSymbol.link(this.input, rbInputSymbol);
    }

    this.oldValue = this.props.value;
    setTimeout(() => {
      this.modelToView(this.props.value);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.modelToView(nextProps.value);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { rbInputSymbol } = this.props;

    if (rbInputSymbol) {
      this._rbInputSymbol = this._rbInputSymbol || new RBInputSymbol();
      this._rbInputSymbol.link(this.input, rbInputSymbol);
    }
  }

  setFocus() {
    this.input.focus();
    this.input.select();
  }

  handleKeyPress = e => {
    this.props.onKeyPress(e);
  };

  handleInputChange = e => {
    const { modelOptions } = this.props;
    if (modelOptions.updateOn && modelOptions.updateOn === 'blur') return;

    this.sendChange('default');
  };

  handleInputBlur = e => {
    this.setState({ hasFocus: false });

    const { onBlur, modelOptions } = this.props;
    if (onBlur) onBlur();
    if (modelOptions.updateOn !== 'blur') return;

    this.sendChange('blur');
  };

  handleInputFocus = () => {
    this.setState({ hasFocus: true });
  };

  sendChange(event) {
    const { modelOptions } = this.props;
    if (!modelOptions.debounce || !modelOptions.debounce[event]) {
      this.viewToModel();
    } else {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.viewToModel();
      }, modelOptions.debounce[event]);
    }
  }

  modelToView(modelValue) {
    const { rbNumberEnabled } = this.props;
    if (rbNumberEnabled) {
      this.input.value = this._rbNumber.formatRomboNumber(
        modelValue,
        this.state.hasFocus
      );
    } else {
      this.input.value = modelValue || '';
    }
  }

  viewToModel() {
    const { rbNumberEnabled, rbNumberOptions, onInputChange } = this.props;
    const viewValue = this.input.value;
    if (rbNumberEnabled) {
      const isValid = this._rbNumber.validate(viewValue);
      if (isValid) {
        const parsedNumber = this._rbNumber.parseRomboNumber(
          viewValue,
          rbNumberOptions
        );
        onInputChange(parsedNumber);
      }
    } else {
      onInputChange(viewValue);
    }

    const {
      rbPasswordCheckerEnabled,
      rbPasswordCheckerScore,
      onPasswordCheckerScoreChanged
    } = this.props;
    if (rbPasswordCheckerEnabled) {
      var score = rbPasswordChecker.check(
        viewValue,
        this.oldValue,
        rbPasswordCheckerScore
      );
      onPasswordCheckerScoreChanged(score);
    }

    this.oldValue = viewValue;
  }

  render() {
    const {
      classes,
      type,
      autoComplete,
      errorCondition,
      textAlign,
      placeholder,
      minLength,
      maxLength,
      onClick
    } = this.props;

    return (
      <input
        ref={c => (this.input = c)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        className={classnames('vd-input', classes, {
          [`vd-align-${textAlign}`]: !!textAlign,
          'vd-input--error': errorCondition
        })}
        onKeyPress={this.handleKeyPress}
        onChange={this.handleInputChange}
        onBlur={this.handleInputBlur}
        onFocus={this.handleInputFocus}
        onClick={onClick}
      />
    );
  }
}

RBInput.propTypes = {
  classes: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  errorCondition: PropTypes.bool,
  textAlign: PropTypes.oneOf(['left', 'right']),
  rbNumberEnabled: PropTypes.bool,
  rbNumberOptions: PropTypes.shape({
    min: PropTypes.number,
    exclusiveMinimum: PropTypes.bool,
    max: PropTypes.number,
    exclusiveMaximum: PropTypes.bool,
    decimalPlaces: PropTypes.number,
    trimInsignificantDigits: PropTypes.bool,
    allowedSuffix: PropTypes.string,
    allowedPrefix: PropTypes.string,
    allowEmpty: PropTypes.bool
  }),
  rbPasswordCheckerEnabled: PropTypes.bool,
  rbPasswordCheckerScore: PropTypes.object,
  onPasswordCheckerScoreChanged: PropTypes.func,
  rbInputSymbol: PropTypes.shape({
    align: PropTypes.oneOf(['left', 'right']),
    icon: PropTypes.string,
    symbol: PropTypes.string
  }),
  modelOptions: PropTypes.shape({
    updateOn: PropTypes.oneOf(['default', 'blur']),
    debounce: PropTypes.shape({
      default: PropTypes.number,
      blue: PropTypes.number
    })
  }),
  onInputChange: PropTypes.func,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func
};

RBInput.defaultProps = {
  type: 'text',
  autoComplete: 'on',
  placeholder: '',
  minLength: 0,
  maxLength: 524288,
  modelOptions: {},
  rbNumberOptions: {},
  onClick: e => {},
  onKeyPress: e => {}
};

export default RBInput;
