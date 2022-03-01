import React from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import { RBHeader, RBButton } from '../../../rombostrap';
import { TextArea } from '../../common/legacy/Basic';

const WarnNoSaleNoteDialog = props => {
  const { isOpen, note, onNoteChange, onRequestClose, onParkSale } = props;
  return (
    <RBDialog size="medium" open={isOpen} onRequestClose={onRequestClose}>
      <RBDialogHeader>
        <RBHeader category="dialog">Add a note to the sale</RBHeader>
      </RBDialogHeader>
      <RBDialogContent>
        <p className="vd-p">
          You are about to park this sale. Add a note so it can be identified by
          the next person who continues this sale.
        </p>
        <TextArea
          value={note}
          onChange={onNoteChange}
          note="Notes can be used to identify a sale in the future, and can contain information that can help complete the sale"
        />
      </RBDialogContent>
      <RBDialogActions>
        <div className="vd-button-group">
          <RBButton category="secondary" onClick={onParkSale}>
            Park Sale
          </RBButton>
        </div>
      </RBDialogActions>
    </RBDialog>
  );
};

export default WarnNoSaleNoteDialog;
