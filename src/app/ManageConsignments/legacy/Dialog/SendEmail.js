import React, { Component } from 'react';

import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../../rombostrap/components/RBDialog';
import { RBHeader, RBFlex, RBTextArea } from '../../../../rombostrap';
import RBInput from '../../../../rombostrap/components/RBInputV1';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';

class SendEmail extends Component {
  state = {};

  open(initialForm) {
    initialForm.type = initialForm.type || 'supplierReturn';
    initialForm.recipientName = initialForm.recipientName || '';
    initialForm.email = initialForm.email || '';
    initialForm.cc = initialForm.cc || '';
    initialForm.subject = initialForm.subject || '';
    initialForm.message = initialForm.message || '';

    this.setState({
      ...initialForm,
      open: true
    });

    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  handleFormChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSend = e => {
    e.preventDefault();
    const { recipientName, email, cc, subject, message } = this.state;
    this.setState({ open: false }, () => {
      this._resolve({ recipientName, email, cc, subject, message });
    });
  };

  render() {
    return (
      <RBDialog
        size="small"
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">
            Send {this.state.type === 'supplierReturn' ? 'Return' : 'Order'}
          </RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBField>
            <RBLabel>Recipient name</RBLabel>
            <RBValue>
              <RBInput
                value={this.state.recipientName}
                onInputChange={value =>
                  this.handleFormChange('recipientName', value)
                }
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Email</RBLabel>
            <RBValue>
              <RBInput
                value={this.state.email}
                onInputChange={value => this.handleFormChange('email', value)}
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Cc</RBLabel>
            <RBValue>
              <RBInput
                value={this.state.cc}
                onInputChange={value => this.handleFormChange('cc', value)}
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Subject</RBLabel>
            <RBValue>
              <RBInput
                value={this.state.subject}
                onInputChange={value => this.handleFormChange('subject', value)}
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Message</RBLabel>
            <RBValue>
              <RBTextArea
                value={this.state.message}
                onChange={e => this.handleFormChange('message', e.target.value)}
              />
            </RBValue>
          </RBField>
        </RBDialogContent>
        <RBDialogActions>
          <RBFlex flex flexJustify="end" flexAlign="center">
            <RBButtonGroup>
              <RBButton category="secondary" onClick={this.handleRequestClose}>
                Cancel
              </RBButton>
              <RBButton category="primary" onClick={this.handleSend}>
                Send
              </RBButton>
            </RBButtonGroup>
          </RBFlex>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default SendEmail;
