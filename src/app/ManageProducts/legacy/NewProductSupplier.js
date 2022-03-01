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
import { RBHeader, RBTextArea, RBButton, RBForm } from '../../../rombostrap';
import RBInput, {
  RBInputErrorMessageSection
} from '../../../rombostrap/components/RBInputV1';

class ProductSupplierModal extends Component {
  state = {
    name: '',
    description: '',
    defaultMarkup: 0,
    formState: {}
  };

  open() {
    this.setState({ open: true }, () => {
      // this.supplierInputRef.setFocus();
    });
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  handleAdd = e => {
    e.preventDefault();
    this.setState({ open: false });
    this._resolve({
      name: this.state.name,
      description: this.state.description,
      defaultMarkup: this.state.defaultMarkup
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

  isInvalidMarkup() {
    const { formState } = this.state;
    if (!formState.children || !formState.children.defaultMarkup) return true;
    return (
      formState.children.defaultMarkup.dirty &&
      formState.children.defaultMarkup.invalid
    );
  }

  render() {
    const { open, name, description, defaultMarkup, formState } = this.state;
    return (
      <RBDialog
        size="small"
        open={open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">Create your supplier</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBForm
            ref={c => (this.formRef = c)}
            onFormStateChanged={this.handleFormStateChange}
          >
            <RBField>
              <RBLabel>Supplier name</RBLabel>
              <RBValue>
                <RBInput
                  ref={c => (this.supplierInputRef = c)}
                  required
                  value={name}
                  onInputChange={value => this.handleInputChange('name', value)}
                  onStateChange={state =>
                    this.handleFormElementStateChange('name', state)
                  }
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
            <RBField>
              <RBLabel>Default Markup</RBLabel>
              <RBValue>
                <RBInput
                  value={defaultMarkup}
                  rbNumberEnabled
                  onInputChange={value =>
                    this.handleInputChange('defaultMarkup', value)
                  }
                  onStateChange={state =>
                    this.handleFormElementStateChange('defaultMarkup', state)
                  }
                />
              </RBValue>
              {this.isInvalidMarkup() && (
                <RBInputErrorMessageSection>
                  Please use numbers only
                </RBInputErrorMessageSection>
              )}
            </RBField>
          </RBForm>
        </RBDialogContent>
        <RBDialogActions>
          <RBButton
            category="primary"
            disabled={formState.invalid}
            onClick={this.handleAdd}
          >
            Add Supplier
          </RBButton>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default ProductSupplierModal;
