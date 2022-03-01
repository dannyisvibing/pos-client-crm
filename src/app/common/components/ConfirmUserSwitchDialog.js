import React, { Fragment } from 'react';
import {
  RBDialog,
  RBButton,
  RBField,
  RBHeader,
  RBInput
} from '../../../rombostrap';
import {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import { getUserEmail, getUserDisplayName } from '../../../modules/user';

const ConfirmUserSwitchDialog = props => {
  const {
    isOpen,
    options: modalParams,
    password,
    onChangePassword,
    onRequestClose,
    onChooseAnotherUser,
    onSwitchUser
  } = props;
  return (
    <RBDialog size="small" open={isOpen} onRequestClose={onRequestClose}>
      <RBDialogHeader>
        <RBHeader category="dialog">Please enter your password</RBHeader>
      </RBDialogHeader>
      <form>
        <RBDialogContent>
          <RBField>
            {modalParams.user && (
              <Fragment>
                <RBLabel>{getUserDisplayName(modalParams.user)}</RBLabel>
                <div className="vd-text--secondary vd-text--sub">
                  {getUserEmail(modalParams.user)}
                </div>
              </Fragment>
            )}
          </RBField>
          <RBField>
            <RBLabel>Password</RBLabel>
            <RBValue>
              <RBInput
                value={password}
                type="password"
                onInputChange={onChangePassword}
              />
            </RBValue>
          </RBField>
        </RBDialogContent>
        <RBDialogActions>
          <RBButton category="secondary" onClick={onChooseAnotherUser}>
            Choose another user
          </RBButton>
          <RBButton category="primary" onClick={onSwitchUser}>
            Switch user
          </RBButton>
        </RBDialogActions>
      </form>
    </RBDialog>
  );
};

export default ConfirmUserSwitchDialog;
