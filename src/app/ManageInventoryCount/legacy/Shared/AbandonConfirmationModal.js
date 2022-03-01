import React, { Component } from 'react';
import MESSAGE from '../../../../constants/stocktake/messages';
import { RBP, RBHeader } from '../../../../rombostrap';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../../rombostrap/components/RBDialog';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';

class AbandonConfirmationModal extends Component {
  state = {};

  open() {
    this.setState({ open: true });
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  handleRequestClose = e => {
    this.setState({ open: false });
  };

  handleConfirm = e => {
    e.preventDefault();
    this.setState({ open: false });
    this._resolve();
  };

  render() {
    return (
      <RBDialog
        size="medium"
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">
            {MESSAGE.view.abandon.modalTitle}
          </RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBP>{MESSAGE.view.abandon.modalText}</RBP>
        </RBDialogContent>
        <RBDialogActions>
          <RBButtonGroup>
            <RBButton category="secondary" onClick={this.handleRequestClose}>
              Cancel
            </RBButton>
            <RBButton category="negative" onClick={this.handleConfirm}>
              {MESSAGE.view.abandon.modalAction}
            </RBButton>
          </RBButtonGroup>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default AbandonConfirmationModal;
