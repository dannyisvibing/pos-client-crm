import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import RBButton from '../RBButton';

class RBCheckboxDropdown extends Component {
  state = {
    open: false,
    selectedAll: false,
    items: []
  };

  componentWillMount() {
    var items = this.props.items;
    this.setState({
      items: items,
      selectedAll: this.allSelected(items)
    });
  }

  allSelected(items) {
    return !_.some(items, item => !item.selected);
  }

  handleToggle = e => {
    e && e.preventDefault();
    this.setState({ open: !this.state.open });
  };

  handleSelectAll = e => {
    var items = this.state.items;
    _.forEach(items, item => {
      item.selected = e.target.checked;
    });
    this.setState({
      items,
      selectedAll: e.target.checked
    });
  };

  handleToggleItemSelect = (selectedItem, selected) => {
    const { entityKey } = this.props;
    var items = this.state.items;
    var index = _.findIndex(
      items,
      item => item[entityKey] === selectedItem[entityKey]
    );
    if (index >= 0) {
      items[index].selected = selected;
      this.setState({
        items,
        selectedAll: this.allSelected(items)
      });
    }
  };

  handleApply = e => {
    e.preventDefault();
    this.handleToggle();
    this.props.onApply(this.state.items);
  };

  render() {
    const { entityName } = this.props;
    const { open, items, selectedAll } = this.state;
    return (
      <div
        className={classnames('dropdown datatable-filter', {
          open: open
        })}
      >
        <div className="dropdown-overlay" onClick={this.handleToggle} />
        <a
          onClick={this.handleToggle}
          className="button datatable-filter-button"
        >
          <span
            className={classnames('chevron down chevron--thick', {
              up: open
            })}
          />
        </a>
        <div className="f-dropdown datatable-filter-dropdown drop-down content large">
          {items.length > 0 && (
            <form
              name="optionalSelectionForm"
              className="datatable-filter-form"
            >
              <ul className="dropdown-checklist" id="datatable-filter">
                <li className="dropdown-checklist-option">
                  <label className="checkbox-label">
                    <input
                      className="checkbox"
                      type="checkbox"
                      onChange={this.handleSelectAll}
                      checked={selectedAll}
                    />
                  </label>
                  <i className="checkbox-icon" />All
                </li>
                <li className="dropdown-checklist-sub-options-container">
                  <ul className="dropdown-checklist-sub-options">
                    {items.map((item, i) => (
                      <li key={i} className="dropdown-checklist-option">
                        <label className="checkbox-label">
                          <input
                            className="checkbox"
                            checked={!!item.selected}
                            onChange={e =>
                              this.handleToggleItemSelect(
                                item,
                                e.target.checked
                              )
                            }
                            type="checkbox"
                          />
                          <i className="checkbox-icon" />
                          {item[entityName]}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              <div className="datatable-filter-form-actions">
                <RBButton category="primary" onClick={this.handleApply}>
                  Apply
                </RBButton>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

RBCheckboxDropdown.propTypes = {
  items: PropTypes.array,
  entityKey: PropTypes.string,
  entityName: PropTypes.string
};

RBCheckboxDropdown.defaultProps = {
  items: [],
  entityKey: 'key',
  entityName: 'name'
};

export default RBCheckboxDropdown;
