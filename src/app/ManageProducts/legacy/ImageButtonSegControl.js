import React, { Component } from 'react';
import classnames from 'classnames';

class ImageButtonSegControl extends Component {
  state = {};

  componentWillMount() {
    if (this.props.options) {
      this.setState({ selected: this.props.options[0] });
    }
  }

  handleChange = event => {
    if (this.props.options) {
      var selected = this.props.options.find(
        option => option.label === event.target.value
      );
      this.setState({ selected });
      this.props.onChange(selected.id);
    }
  };

  render() {
    const { classes, primary, options = [] } = this.props;
    return (
      <div className={classnames('vd-flex', classes)}>
        {options.map((option, i) => (
          <label key={i} className="vd-segcontrol vd-segcontrol--panel">
            <input
              className="vd-segcontrol-input"
              type="radio"
              name="radio"
              value={option.label}
              checked={option.id === this.state.selected.id}
              onChange={this.handleChange}
            />
            <div
              className={classnames('vd-button vd-button--panel', {
                'vd-button--primary':
                  option.id === this.state.selected.id && primary,
                'vd-button--stroke': option.id === this.state.selected.id
              })}
            >
              <img src={option.img} alt="" />
              <span className="mts">{option.label}</span>
            </div>
          </label>
        ))}
      </div>
    );
  }
}

export default ImageButtonSegControl;
