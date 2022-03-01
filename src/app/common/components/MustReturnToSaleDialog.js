import React from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import { RBHeader, RBButton } from '../../../rombostrap';

const MustReturnToSaleDialog = props => {
  const { isOpen, onRequestClose, onReturn } = props;
  return (
    <RBDialog size="small" open={isOpen} onRequestClose={onRequestClose}>
      <RBDialogHeader>
        <RBHeader category="dialog">
          Please complete your previous sale
        </RBHeader>
      </RBDialogHeader>
      <RBDialogContent>
        <p className="vd-p">
          You've taken payments on your previous sale, so that sale must be
          completed, or put on account or Layby
        </p>
      </RBDialogContent>
      <RBDialogActions>
        <RBButton category="primary" onClick={onReturn}>
          Return to Sale in Progress
        </RBButton>
      </RBDialogActions>
    </RBDialog>
  );
};

export default MustReturnToSaleDialog;
