import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  RBDialog,
  RBHeader,
  RBP,
  RBField,
  RBButton
} from '../../../../rombostrap';
import {
  RBDialogContent,
  RBDialogHeader,
  RBDialogActions
} from '../../../../rombostrap/components/RBDialog';
import { RBLabel, RBValue } from '../../../../rombostrap/components/RBField';
import RBInput from '../../../../rombostrap/components/RBInputV1';
import { RBButtonGroup } from '../../../../rombostrap/components/RBButton';
import { getUserDisplayName } from '../../../../modules/user';

class SaveModal extends Component {
  state = {
    open: false,
    currentPassword: ''
  };

  open() {
    this.setState({ currentPassword: '', open: true });
    return new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handlePasswordChange = password => {
    this.setState({ currentPassword: password });
  };

  handleSave = e => {
    e.preventDefault();
    this.setState({ open: false }, () =>
      this.resolve(this.state.currentPassword)
    );
  };

  render() {
    const { user } = this.props;
    return (
      <RBDialog
        open={this.state.open}
        size="small"
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">
            Confirm you can make these changes
          </RBHeader>
        </RBDialogHeader>
        <form>
          <RBDialogContent>
            <RBP>
              Please enter your password to confirm you are allowed to make
              changes to "{getUserDisplayName(user)}"
            </RBP>
            <RBField classes="vd-mbn">
              <RBLabel>Your Password</RBLabel>
              <RBValue>
                <RBInput
                  type="password"
                  autoComplete="off"
                  value={this.state.currentPassword}
                  onInputChange={this.handlePasswordChange}
                />
              </RBValue>
            </RBField>
          </RBDialogContent>
          <RBDialogActions>
            <RBButtonGroup>
              <RBButton
                category="primary"
                disabled={!this.state.currentPassword}
                onClick={this.handleSave}
              >
                <span>Save these changes</span>
              </RBButton>
            </RBButtonGroup>
          </RBDialogActions>
        </form>
      </RBDialog>
    );
  }
}

SaveModal.propTypes = {
  open: PropTypes.bool
};

export default SaveModal;
