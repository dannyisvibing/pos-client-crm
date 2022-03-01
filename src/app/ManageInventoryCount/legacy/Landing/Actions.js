import React, { Component } from 'react';
import classnames from 'classnames';

class LandingActions extends Component {
  state = {};

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { selectionTotal, selectedAll, onDeleteStocktakes } = this.props;
    return (
      <div className="landing-actions">
        <div
          className={classnames('dropdown', {
            open: this.state.open
          })}
          onClick={this.toggle}
        >
          <div className="dropdown-overlay" onClick={this.toggle} />
          <a
            className="button with-right-chevron action-popup-title"
            onClick={this.toggle}
          >
            <span>
              {selectionTotal} selected{selectedAll ? ' (all)' : ''}
            </span>
            <span className="chevron down" />
          </a>
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={onDeleteStocktakes}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingActions;
