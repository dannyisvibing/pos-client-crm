import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dropdownItemGroupFilter from '../utils/dropdownItemGroup';
import AdvancedReportingService from '../../../modules/reporting/advanced-reporting-service';

class DropDownMenu extends Component {
  state = {
    open: false,
    itemGroups: [],
    columns: false,
    groupBy: false,
    userCanAccessAdvancedReporting: AdvancedReportingService.userCanAccessAdvancedReporting(),
    hasAdvancedItems: false
  };

  componentWillMount() {
    const { filter, items, columns, groupBy } = this.props;
    var advancedItemsFilter, itemGroups;
    itemGroups = this.state.itemGroups;
    advancedItemsFilter = {
      isAdvanced: true
    };
    if (filter) {
      advancedItemsFilter[filter.key] = filter.value;
    }
    if (columns) {
      itemGroups = this.createListColumns();
    } else if (groupBy) {
      itemGroups = this.createGroupList();
    } else {
      itemGroups[0] = items;
    }
    this.setState({
      itemGroups,
      hasAdvancedItems: _.some(items, advancedItemsFilter)
    });
  }

  createListColumns() {
    var columnKey, itemCount, itemGroups, itemKeys, listSize;
    const { items } = this.props;
    itemKeys = _.keys(items).sort();
    itemCount = itemKeys.length;
    listSize = Math.ceil(itemCount / 2);
    itemGroups = [{}, {}];
    columnKey = 0;
    _.forEach(itemKeys, function(itemKey, i) {
      if (i >= listSize && columnKey !== 1) {
        columnKey = 1;
      }
      return (itemGroups[columnKey][itemKey] = items[itemKey]);
    });
    return itemGroups;
  }

  createGroupList() {
    var itemGroups;
    const { items, groupBy } = this.props;
    itemGroups = _.groupBy(items, groupBy);
    return itemGroups;
  }

  /**
   * Determines if the provided item is 'Advanced' and cannot be currently accessed due to the user having insufficient permissions
   *
   * @method isRestrictedItem
   *
   * @param {ReportDefinition} item The item to evaluate
   */
  isRestrictedItem(item) {
    return !AdvancedReportingService.isDefinitionAccessible(item);
  }

  /**
   * Responsible for showing the 'Advanced' toggle within the dropdown. This is used to reveal 'Advanced' items to users who not have the sufficient permissions
   * to view them.
   *
   * @return {Boolean} True if the 'Advanced' item show be shown, false otherwise
   */
  shouldShowAdvancedToggle() {
    return (
      !this.state.userCanAccessAdvancedReporting &&
      this.state.hasAdvancedItems &&
      !this.state.advancedItemsRevealed
    );
  }

  /**
   * Reveals the 'isAdvanced' items for the dropdown. Hidden initially if the user does not have permission to view 'Advanced' options.
   */
  revealAdvancedItems() {
    this.setState({ advancedItemsRevealed: true });
  }

  /**
   * Determines if the current item can be shown / is accessible to the current user.
   */
  itemCanBeShown(item) {
    return (
      AdvancedReportingService.isDefinitionAccessible(item) ||
      this.state.advancedItemsRevealed
    );
  }

  /**
   * Determines if the visibility of a group of items. Handles a group of items that contains only 'Advanced' items,
   * in which case the entire group should be hidden
   *
   * @param {Array} items Teh collection of Report Definition to evaluate
   */
  groupCanBeShown(items) {
    if (
      this.state.userCanAccessAdvancedReporting ||
      this.state.advancedItemsRevealed
    ) {
      return true;
    } else {
      return !_.every(items, function(item) {
        return item.isAdvanced;
      });
    }
  }

  isActive(item) {
    return this.props.selectedItem === item;
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  select = item => {
    if (this.isRestrictedItem(item)) {
      // Display Plan
    } else {
      const { onSelect } = this.props;
      onSelect && onSelect(item);
    }
  };

  render() {
    const { label, selectedItem, filter, display } = this.props;
    const { itemGroups } = this.state;
    var _ref;

    return (
      <div>
        {label && <span className="dropdown-label">{label}</span>}
        <div
          className={classnames('dropdown', {
            open: this.state.open
          })}
          onClick={this.toggle}
        >
          <div className="dropdown-overlay" onClick={this.toggle} />
          <a className="button with-right-chevron" onClick={this.toggle}>
            <span>{display(selectedItem)}</span>
            <span className="chevron down" />
          </a>
          <div className="dropdown-menu">
            {(_ref = dropdownItemGroupFilter(itemGroups, filter)).reduce(
              (menu, items, i) => {
                if (!this.groupCanBeShown(items)) return menu;
                items.forEach(item => {
                  if (!this.itemCanBeShown(item)) return;
                  menu.push(
                    <button
                      key={menu.length}
                      className={classnames('dropdown-item', {
                        active: this.isActive(item),
                        'restricted-item': this.isRestrictedItem(item)
                      })}
                      onClick={e => this.select(item)}
                    >
                      {item.name}
                    </button>
                  );
                });
                if (i !== _ref.length - 1) {
                  menu.push(
                    <div key={menu.length} className="dropdown-divider" />
                  );
                }
                return menu;
              },
              []
            )}
          </div>
        </div>
      </div>
    );
  }
}

DropDownMenu.propTypes = {
  label: PropTypes.string,
  filter: PropTypes.object,
  items: PropTypes.any,
  selectedItem: PropTypes.any,
  columns: PropTypes.bool,
  groupBy: PropTypes.any,
  heading: PropTypes.any,
  display: PropTypes.func
};

DropDownMenu.defaultProps = {
  display: function(item) {
    return item.name;
  }
};

export default DropDownMenu;
