import React from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import { RBHeader, RBButton } from '../../../rombostrap';

function getDescription(isChangeByRegister) {
  if (isChangeByRegister) {
    return 'Before you can switch registers, you have to complete the sale on the Sell screen. You can choose to save that sale and continue on to switch registers, or return to that sale to complete it';
  } else {
    return "You have a sale on the Sell screen that hasn't been completed. You can choose to return to that sale to complete it, or save that sale and continue with this one.";
  }
}

const SaleChangeConfirmationDialog = props => {
  const {
    isOpen,
    isChangeByRegister = false,
    onRequestClose,
    onReturn,
    onConfirm
  } = props;
  return (
    <RBDialog size="medium" open={isOpen} onRequestClose={onRequestClose}>
      <RBDialogHeader>
        <RBHeader category="dialog">
          Hold up! You currently have a sale in progress
        </RBHeader>
      </RBDialogHeader>
      <RBDialogContent>
        <p className="vd-p">{getDescription(isChangeByRegister)}</p>
      </RBDialogContent>
      <RBDialogActions>
        <div className="vd-button-group">
          <RBButton category="secondary" onClick={onReturn}>
            Return to Sale in Progress
          </RBButton>
          <RBButton category="primary" onClick={onConfirm}>
            Save and Continue
          </RBButton>
        </div>
      </RBDialogActions>
    </RBDialog>
  );
};

export default SaleChangeConfirmationDialog;
