import React, { Component } from 'react';
import STATES from '../../../../constants/states';
import MESSAGES from '../../../../constants/stocktake/messages';
import STOCKTAKE_ITEMS_STATUS from '../../../../constants/stocktake/stocktake-item-status';
import { RBSection, RBFlex } from '../../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';
import AbandonConfirmationModal from '../Shared/AbandonConfirmationModal';
import CompleteConfirmationModal from '../Shared/CompleteConfirmationModal';
import stocktakeItemsStatusFilter from '../utils/stocktake-items-status-filter';

class ReviewActionBar extends Component {
  state = {};

  handleOpenAbandonModal = e => {
    e.preventDefault();
    this.abandonModal.open().then(() => {
      this.props.onAbandon();
    });
  };

  handleOpenCompleteModal = e => {
    e.preventDefault();

    const { stocktakeItems } = this.props;
    var completeMessage = MESSAGES.view.complete,
      alertMessage = completeMessage.modalAlert,
      uncountedItemsCount = stocktakeItemsStatusFilter(
        stocktakeItems,
        STOCKTAKE_ITEMS_STATUS.uncounted
      ),
      modalText = completeMessage.modalText.success,
      alertText = '';

    if (uncountedItemsCount === 1) {
      alertText = alertMessage.singular;
      modalText = completeMessage.modalText.warning.singular;
    } else if (uncountedItemsCount > 1) {
      alertText = alertMessage.plural.replace(
        '{{uncountedItems}}',
        uncountedItemsCount
      );
      modalText = completeMessage.modalText.warning.plural;
    }

    this.completeModal
      .open({
        heading: completeMessage.modalTitle,
        bodyText: modalText,
        alertText: alertText,
        actionText: completeMessage.modalAction
      })
      .then(() => {
        this.props.onStartCompleteAction();
      });
  };

  render() {
    const { classes, stateItems, stocktake, onResume } = this.props;
    return (
      <div className={classes}>
        <RBSection type="secondary">
          <RBFlex flex flexJustify="between" flexAlign="center">
            <span className="action-bar-description">
              Review any discrepancies, then choose to resume your count or
              complete it.
            </span>
            <RBButtonGroup>
              <RBButton
                category="negative"
                modifiers={['text', 'subtle']}
                onClick={this.handleOpenAbandonModal}
              >
                Abandon
              </RBButton>
              <RBButton category="secondary" onClick={onResume}>
                Resume
              </RBButton>
              <RBButton
                category="primary"
                disabled={
                  stocktake.isInProgressProcessing() ||
                  stateItems !== STATES.success
                }
                onClick={this.handleOpenCompleteModal}
              >
                Complete
              </RBButton>
            </RBButtonGroup>
          </RBFlex>
        </RBSection>
        <AbandonConfirmationModal ref={c => (this.abandonModal = c)} />
        <CompleteConfirmationModal ref={c => (this.completeModal = c)} />
      </div>
    );
  }
}

export default ReviewActionBar;
