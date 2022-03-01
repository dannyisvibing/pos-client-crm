import React from 'react';
import Dialog, {
  DialogHeader,
  DialogContent,
  DialogActions
} from '../../common/legacy/Dialog';
import { Button, Header } from '../../common/legacy/Basic';

const WarnPermanentAction = ({ open, onConfirm, onRequestClose }) => (
  <Dialog small open={open} onRequestClose={onRequestClose}>
    <DialogHeader>
      <Header dialog>Are you sure?</Header>
    </DialogHeader>
    <DialogContent>
      <p className="vd-p">
        You are about to perform an action that can't be undone
      </p>
    </DialogContent>
    <DialogActions>
      <Button negative inline onClick={onConfirm}>
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default WarnPermanentAction;
