import React, { Component } from 'react';
import {
  RBDialog,
  RBHeader,
  RBInput,
  RBFlex,
  RBButton,
  RBField
} from '../../../../rombostrap';
import {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../../rombostrap/components/RBDialog';
import { RBLabel, RBValue } from '../../../../rombostrap/components/RBField';

class NewSalesTax extends Component {
  state = {
    formState: {}
  };

  open() {
    this.setState({
      open: true,
      name: '',
      rate: ''
    });

    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  handleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ open: false }, () => {
      this._resolve({
        name: this.state.name,
        rate: this.state.rate
      });
    });
  };

  handleFormStateChange = state => {
    this.setState({
      formState: state
    });
  };

  render() {
    return (
      <RBDialog
        size="medium"
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">Add sales tax</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBField>
            <RBLabel>Tax name</RBLabel>
            <RBValue>
              <RBInput
                value={this.state.name}
                onInputChange={value => this.handleChange('name', value)}
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Tax rate (%)</RBLabel>
            <RBValue>
              <RBInput
                rbNumberEnabled
                rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
                value={this.state.rate}
                onInputChange={value => this.handleChange('rate', value)}
                onStateChange={state => this.handleFormStateChange(state)}
              />
            </RBValue>
          </RBField>
        </RBDialogContent>
        <RBDialogActions>
          <RBFlex flex flexJustify="end">
            <RBButton
              category="secondary"
              classes="vd-mrl"
              onClick={this.handleRequestClose}
            >
              Cancel
            </RBButton>
            <RBButton
              category="primary"
              onClick={this.handleSubmit}
              disabled={this.state.formState.invalid}
            >
              Add sales tax
            </RBButton>
          </RBFlex>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default NewSalesTax;
