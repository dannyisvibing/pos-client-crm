import React, { Component } from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import { RBHeader, RBButton } from '../../../rombostrap';
import RBInput from '../../../rombostrap/components/RBInputV1';

class ProductTypeModal extends Component {
  state = {
    name: '',
    formState: {}
  };

  open() {
    this.setState({ open: true }, () => {
      // this.inputRef.setFocus();
    });
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  handleAdd = e => {
    e.preventDefault();
    this.setState({ open: false });
    this._resolve({ name: this.state.name });
  };

  handleInputChange = value => {
    this.setState({ name: value });
  };

  handleFormStateChange = state => {
    this.setState({ formState: state });
  };

  render() {
    const { open, formState, name } = this.state;
    return (
      <RBDialog
        size="small"
        open={open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">Add Product Type</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBField>
            <RBLabel>Type name</RBLabel>
            <RBValue>
              <RBInput
                ref={c => (this.inputRef = c)}
                required
                value={name}
                onInputChange={this.handleInputChange}
                onStateChange={this.handleFormStateChange}
              />
            </RBValue>
          </RBField>
        </RBDialogContent>
        <RBDialogActions>
          <RBButton
            category="primary"
            disabled={formState.invalid}
            onClick={this.handleAdd}
          >
            Add Type
          </RBButton>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default ProductTypeModal;
