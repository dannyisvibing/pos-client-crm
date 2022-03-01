import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class Tabs extends Component {
  state = {
    selected: undefined
  };

  componentWillMount() {
    this.setState({ selected: this.props.tabs[0] });
  }

  toggleTab = (e, tab) => {
    this.setState({ selected: tab }, () => this.props.onChange(tab));
  };

  render() {
    const { classes, tabs } = this.props;
    const { selected } = this.state;
    return (
      <div className={classnames('vd-tabs', classes)}>
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={classnames('vd-tab', {
              'vd-tab--active': tab.id === selected.id
            })}
          >
            <button
              className="vd-tab-button"
              type="button"
              onClick={e => this.toggleTab(e, tab)}
            >
              <span>{tab.label}</span>
            </button>
          </div>
        ))}
      </div>
    );
  }
}

Tabs.propTypes = {
  classes: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    })
  )
};

Tabs.defaultProps = {
  classes: '',
  tabs: []
};

export default Tabs;
