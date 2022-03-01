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
import { RBHeader, RBTextArea, RBButton } from '../../../rombostrap';
import RBInput from '../../../rombostrap/components/RBInputV1';

class ProductBrandModal extends Component {
  state = {
    name: '',
    description: '',
    formState: {}
  };

  open() {
    this.setState({ open: true }, () => {
      // this.brandInputRef.setFocus();
    });
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  handleAdd = e => {
    e.preventDefault();
    this.setState({ open: false });
    this._resolve({
      name: this.state.name,
      description: this.state.description
    });
  };

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  handleFormStateChange = state => {
    this.setState({ formState: state });
  };

  render() {
    const { open, name, description, formState } = this.state;
    return (
      <RBDialog
        size="small"
        open={open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">Add Brand</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBField>
            <RBLabel>Brand name</RBLabel>
            <RBValue>
              <RBInput
                ref={c => (this.brandInputRef = c)}
                required
                value={name}
                onInputChange={value => this.handleInputChange('name', value)}
                onStateChange={this.handleFormStateChange}
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Description</RBLabel>
            <RBValue>
              <RBTextArea
                value={description}
                onChange={e =>
                  this.handleInputChange('description', e.target.value)
                }
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
            Add Brand
          </RBButton>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default ProductBrandModal;
