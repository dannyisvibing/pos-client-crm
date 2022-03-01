import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import MESSAGES from '../../../../constants/stocktake/messages';

import CompleteConfirmationModal from '../Shared/CompleteConfirmationModal';

class Actions extends Component {
  state = {};

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  getSelectionTotal() {
    return _.size(this.props.selectedStocktakeItems);
  }

  hasExcludedItem(excluded) {
    const { selectedStocktakeItems } = this.props;
    return _.size(_.filter(selectedStocktakeItems, { excluded }));
  }

  amountOfRecountableItems() {
    return _.size(this._getRecountableItems());
  }

  _getRecountableItems() {
    const { selectedStocktakeItems } = this.props;
    return _.filter(selectedStocktakeItems, stocktakeItem => {
      return (
        stocktakeItem.counted !== null &&
        !stocktakeItem.isZeroCounted() &&
        !stocktakeItem.excluded
      );
    });
  }

  _getRecountMessage(messageType) {
    var recountableItems = this._getRecountableItems(),
      recountItemsMessage = MESSAGES.view.recountItems,
      message = recountItemsMessage[messageType],
      itemsCount = _.size(recountableItems);

    if (itemsCount === 1) {
      message = message.singular;
    } else {
      message = message.plural.replace('{{itemNumber}}', itemsCount);
    }

    return message;
  }

  handleOpenResetCountModal = e => {
    e.preventDefault();

    var modalTitle = this._getRecountMessage('modalTitle'),
      modalText = this._getRecountMessage('modalText');

    this.completeModal
      .open({
        heading: modalTitle,
        bodyText: modalText,
        actionText: MESSAGES.view.recountItems.modalAction,
        alertText: ''
      })
      .then(() => {
        this.props.onResetCount();
      });
  };

  handleMarkItemAsExcluded = (e, doExlude) => {
    e.preventDefault();
    this.props.onMarkItemAsExcluded(e, doExlude);
  };

  render() {
    const { selectedAll } = this.props;

    return (
      <div className="collections-actions">
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
              {this.getSelectionTotal()} selected{selectedAll ? ' (all)' : ''}
            </span>
            <span className="chevron down" />
          </a>
          <div className="dropdown-menu">
            {!!this.amountOfRecountableItems() && (
              <button
                className="dropdown-item"
                onClick={this.handleOpenResetCountModal}
              >
                Recount items
              </button>
            )}
            {!!this.hasExcludedItem(true) && (
              <button
                className="dropdown-item"
                onClick={e => this.handleMarkItemAsExcluded(e, false)}
              >
                Include items from count
              </button>
            )}
            {!!this.hasExcludedItem(false) && (
              <button
                className="dropdown-item"
                onClick={e => this.handleMarkItemAsExcluded(e, true)}
              >
                Exclude items from count
              </button>
            )}
          </div>
        </div>
        <CompleteConfirmationModal ref={c => (this.completeModal = c)} />
      </div>
    );
  }
}

export default Actions;
