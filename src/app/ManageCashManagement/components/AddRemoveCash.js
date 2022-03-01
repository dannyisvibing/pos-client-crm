import React, { Component } from 'react';
import { RBForm, RBField } from '../../../rombostrap';
import RBInput from '../../../rombostrap/components/RBInputV1';
import { RBValue, RBLabel } from '../../../rombostrap/components/RBField';
import Dialog, {
  DialogHeader,
  DialogContent,
  DialogActions
} from '../../common/legacy/Dialog';
import { RadioButton, Input, Button, Header } from '../../common/legacy/Basic';
import CashMovementTypes from '../../../constants/cashMovementTypes';

class AddRemoveCash extends Component {
  state = {
    option: '',
    cashAmount: '',
    note: '',
    formState: {}
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.open && nextProps.open) {
      this.setState({
        option: nextProps.isAdding
          ? CashMovementTypes.add[0].value
          : CashMovementTypes.remove[0].value
      });
    }
  }

  handleChangeOption = e => {
    this.setState({ option: e.target.value });
  };

  handleChangeForm = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = () => {
    this.props.onSubmit({
      ...this.state,
      cashAmount: parseFloat(this.state.cashAmount)
    });
  };

  handleFormStateChange = formState => {
    this.setState({ formState });
  };

  handleFormElementStateChange = (name, state) => {
    if (!this.formRef) {
      setTimeout(() => {
        this.handleFormElementStateChange(name, state);
      }, 0);
    } else {
      this.formRef.onStateChanged(name, state);
    }
  };

  isInvalid() {
    const { formState } = this.state;
    if (!formState.children) return true;
    return formState.children.cashAmount.invalid;
  }

  render() {
    const { isAdding } = this.props;
    return (
      <Dialog
        medium
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
      >
        <DialogHeader>
          <Header dialog>{isAdding ? 'Add Cash' : 'Remove Cash'}</Header>
        </DialogHeader>
        <DialogContent>
          <RBForm
            ref={c => (this.formRef = c)}
            onFormStateChanged={this.handleFormStateChange}
          >
            <RadioButton
              primary
              radios={
                isAdding ? CashMovementTypes.add : CashMovementTypes.remove
              }
              value={this.state.option}
              onChange={this.handleChangeOption}
            />
            <RBField>
              <RBLabel>Amount</RBLabel>
              <RBValue>
                <RBInput
                  required
                  value={this.state.cashAmount}
                  placeholder="e.g, 50.00"
                  rbNumberEnabled
                  rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
                  onInputChange={value =>
                    this.handleChangeForm('cashAmount', value)
                  }
                  onStateChange={state =>
                    this.handleFormElementStateChange('cashAmount', state)
                  }
                />
              </RBValue>
            </RBField>
            <Input
              label="Note"
              placeholder="Type to add a note"
              value={this.state.note}
              onChange={e => this.handleChangeForm('note', e.target.value)}
            />
          </RBForm>
        </DialogContent>
        <DialogActions>
          <Button
            primary
            negative={!isAdding}
            inline
            disabled={this.isInvalid()}
            onClick={this.handleSubmit}
          >
            {isAdding ? 'Add Cash' : 'Remove Cash'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddRemoveCash;
