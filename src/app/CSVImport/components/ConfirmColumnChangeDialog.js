import React, { Component } from 'react';
import { RBHeader, RBFlex, RBSegControl } from '../../../rombostrap';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import CSVMatchCardSampleData from './CSVMatchCardSampleData';

class ConfirmColumnChangeDialog extends Component {
  state = {
    targetCard: {},
    sourceCard: {},
    selectedCardIndex: -1
  };

  open(targetCard, sourceCard) {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;

      this.setState({
        open: true,
        targetCard,
        sourceCard,
        selectedCardIndex: targetCard.index
      });
    });
  }

  handleIndexChange = e => {
    this.setState({ selectedCardIndex: e.target.value });
  };

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  handleChoose = e => {
    e.preventDefault();

    this.setState({ open: false });
    this._resolve(this.state.targetCard.index === this.state.selectedCardIndex);
  };

  render() {
    const { targetCard, sourceCard, selectedCardIndex } = this.state;

    return (
      <RBDialog
        open={this.state.open}
        size="large"
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">
            Hold up! You can't import two columns as "{
              (targetCard.matchedColumn || {}).name
            }".
          </RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          Please choose which column to import as "{
            (targetCard.matchedColumn || {}).name
          }".
          <RBFlex flex classes="vd-mtl">
            <RBSegControl
              classes="vd-col-8"
              value={targetCard.index}
              checked={selectedCardIndex === targetCard.index}
              onChange={this.handleIndexChange}
            >
              <CSVMatchCardSampleData data={targetCard.sampleData} />
            </RBSegControl>
            <RBSegControl
              classes="vd-col-8"
              value={sourceCard.index}
              checked={selectedCardIndex === sourceCard.index}
              onChange={this.handleIndexChange}
            >
              <CSVMatchCardSampleData data={sourceCard.sampleData} />
            </RBSegControl>
          </RBFlex>
        </RBDialogContent>
        <RBDialogActions>
          <RBButtonGroup>
            <RBButton category="primary" onClick={this.handleChoose}>
              Choose Column
            </RBButton>
          </RBButtonGroup>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default ConfirmColumnChangeDialog;
