import React from 'react';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import { RBHeader, RBButton } from '../../../rombostrap';
import {
  SALE_SUBSTATUS_LAYBY,
  SALE_SUBSTATUS_ON_ACCOUNT
} from '../../../modules/sale/sale.constants';

const SaleLostWarnDialog = props => {
  const {
    isOpen,
    saleInProgress,
    onContinueSale,
    onDiscardChanges,
    onRequestClose
  } = props;
  let label = '';
  if (saleInProgress.saleSubStatus === SALE_SUBSTATUS_LAYBY) label = 'Layby';
  if (saleInProgress.saleSubStatus === SALE_SUBSTATUS_ON_ACCOUNT)
    label = 'on Account';
  return (
    <RBDialog size="medium" open={isOpen} onRequestClose={onRequestClose}>
      <RBDialogHeader>
        <RBHeader category="dialog">
          What would you like to do with this sale?
        </RBHeader>
      </RBDialogHeader>
      <RBDialogContent>
        <p className="vd-p">
          You haven't completed this sale and are about to lost the changes
          you've made. To keep those changes, continue the sale to accept
          payment or put it back {label}
        </p>
      </RBDialogContent>
      <RBDialogActions>
        <div className="vd-button-group">
          <RBButton category="secondary" onClick={onContinueSale}>
            Continue Sale
          </RBButton>
          <RBButton category="primary" onClick={onDiscardChanges}>
            Discard Changes
          </RBButton>
        </div>
      </RBDialogActions>
    </RBDialog>
  );
};

export default SaleLostWarnDialog;
