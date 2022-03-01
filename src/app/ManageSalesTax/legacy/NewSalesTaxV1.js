import React, { Component } from 'react';
import Dialog, {
  DialogHeader,
  DialogContent,
  DialogActions
} from '../../common/legacy/Dialog';
import { Input, Button, Header } from '../../common/legacy/Basic';
import { RBField } from '../../../rombostrap';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import RBInput from '../../../rombostrap/components/RBInputV1';

class NewSalesTax extends Component {
  state = {
    name: '',
    rate: 0,
    formState: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      const { taxInfo } = nextProps;
      if (taxInfo) {
        this.setState({
          name: taxInfo.name,
          rate: taxInfo.rate,
          isSave: true
        });
      }
    }
  }

  handleTaxChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleFormStateChange = state => {
    this.setState({
      formState: state
    });
  };

  render() {
    const { open, onRequestClose, onSubmit } = this.props;
    return (
      <Dialog medium open={open} onRequestClose={onRequestClose}>
        <DialogHeader>
          <Header dialog>Add sales tax</Header>
        </DialogHeader>
        <DialogContent>
          <Input
            id="tax-name-on-mdal"
            label="Tax name"
            value={this.state.name}
            onChange={e => this.handleTaxChange('name', e.target.value)}
          />
          <RBField>
            <RBLabel>Tax rate (%)</RBLabel>
            <RBValue>
              <RBInput
                rbNumberEnabled
                rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
                value={this.state.rate}
                onInputChange={value => this.handleTaxChange('rate', value)}
                onStateChange={state => this.handleFormStateChange(state)}
              />
            </RBValue>
          </RBField>
        </DialogContent>
        <DialogActions>
          <div className="vd-flex vd-flex--justify-end">
            <Button secondary onClick={onRequestClose}>
              Cancel
            </Button>
            <Button
              classes="vd-mlm"
              primary
              disabled={this.state.formState.invalid}
              onClick={() => onSubmit(this.state)}
            >
              {this.state.isSave ? 'Save sales tax' : 'Add sales tax'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NewSalesTax;
