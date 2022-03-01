import React from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import { RBHeader, RBButton } from '../../../rombostrap';

const OfflineNotificationDialog = props => {
  const { isOpen, onRequestClose, onGoto } = props;
  return (
    <RBDialog
      size="medium"
      open={isOpen}
      showClose={false}
      onRequestClose={onRequestClose}
    >
      <RBDialogHeader>
        <RBHeader category="dialog">
          You can't access this content while offline
        </RBHeader>
      </RBDialogHeader>
      <RBDialogContent>
        <p className="vd-p">
          You'll be able to access this again when you're online. Meanwhile you
          can continue to make sales on the Sell Screen.
        </p>
      </RBDialogContent>
      <RBDialogActions>
        <RBButton category="primary" onClick={onGoto}>
          Go to the Sell Screen
        </RBButton>
      </RBDialogActions>
    </RBDialog>
  );
};

export default OfflineNotificationDialog;
