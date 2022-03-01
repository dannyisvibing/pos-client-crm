import React, { Component } from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../../rombostrap/components/RBDialog';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';
import { RBP, RBHeader } from '../../../../rombostrap';

class CompleteConfirmationModal extends Component {
  state = {};

  open(data = {}) {
    this.setState({ open: true, ...data });
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
    const { heading, alertText, bodyText, actionText } = this.state;
    return (
      <RBDialog
        size="medium"
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">{heading}</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBP>{alertText}</RBP>
          <RBP>{bodyText}</RBP>
        </RBDialogContent>
        <RBDialogActions>
          <RBButtonGroup>
            <RBButton category="secondary" onClick={this.handleRequestClose}>
              Cancel
            </RBButton>
            <RBButton category="primary" onClick={this.handleConfirm}>
              {actionText}
            </RBButton>
          </RBButtonGroup>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default CompleteConfirmationModal;
