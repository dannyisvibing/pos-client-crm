import React, { Component } from 'react';
import Dialog, {
  DialogHeader,
  DialogContent,
  DialogActions
} from '../../common/legacy/Dialog';
import { Input, Button, Header } from '../../common/legacy/Basic';

class NewProductTypeDialog extends Component {
  state = { variantAttr: '' };

  handleVariantAttrChange = e => {
    this.setState({ variantAttr: e.target.value });
  };

  render() {
    const { open, onRequestClose, onSubmit } = this.props;
    return (
      <Dialog medium open={open} onRequestClose={onRequestClose}>
        <DialogHeader>
          <Header dialog>New Variant Attribute</Header>
        </DialogHeader>
        <DialogContent>
          <Input
            id="attr-name-on-mdal"
            label="Option name"
            onChange={this.handleVariantAttrChange}
          />
        </DialogContent>
        <DialogActions>
          <div className="vd-flex vd-flex--justify-end">
            <Button secondary onClick={onRequestClose}>
              Cancel
            </Button>
            <Button
              classes="vd-mlm"
              primary
              onClick={() => onSubmit(this.state.variantAttr)}
            >
              Submit
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NewProductTypeDialog;
