import React from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import { RBHeader, RBButton, RBP } from '../../../rombostrap';

const WarnPermanentActionDialog = props => {
  const { isOpen } = props;
  return (
    <RBDialog size="small" open={isOpen} onRequestClose={props.onCloseDialog}>
      <RBDialogHeader>
        <RBHeader category="dialog">Are you sure?</RBHeader>
      </RBDialogHeader>
      <RBDialogContent>
        <RBP>You are about to perform an action that can't be undone</RBP>
      </RBDialogContent>
      <RBDialogActions>
        <RBButton category="negative" onClick={props.onConfirmAction}>
          OK
        </RBButton>
      </RBDialogActions>
    </RBDialog>
  );
};

export default WarnPermanentActionDialog;
