import React from 'react';
import { RBSection, RBFlex } from '../../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';

function getSendButtonTitle(type, again) {
  if (type === 'supplierOrder' || type === 'outletTransfer')
    return !again ? 'Send Order' : 'Resend Order';
  return !again ? 'Send Return' : 'Resend Return';
}

function getCancelButtonTitle(type) {
  if (type === 'supplierOrder' || type === 'outletTransfer')
    return 'Cancel Order';
  return 'Cancel Return';
}

function editProductsAvailable(status) {
  return status === 'open';
}

function sendAvailable(status) {
  return status === 'open';
}

function resendAvailable(type, status) {
  return type !== 'supplierReturn' && status === 'sent';
}

// function importAvailable(status) {
//   return status === 'open';
// }

function markAsSentAvailable(status) {
  return status === 'open';
}

function editDetailsAvailable(type, status) {
  return type !== 'supplierReturn' && (status === 'open' || status === 'sent');
}

function receiveAvailable(type, status) {
  return type !== 'supplierReturn' && status === 'sent';
}

function cancelAvailable(type, status) {
  if (status === 'open') {
    return true;
  } else if (type !== 'supplierReturn' && status === 'sent') {
    return true;
  } else {
    return false;
  }
}

const ActionBar = ({
  id,
  status,
  type,
  canSend,
  onSend,
  onExport,
  onMarkAsSent,
  onCancel
}) => (
  <RBSection type="action-bar">
    <RBFlex flex flexJustify="between">
      <RBButtonGroup>
        {editProductsAvailable(status) && (
          <RBButton
            href={`/product/consignment/${id}/edit`}
            modifiers={['text']}
            category="secondary"
          >
            Edit Products
          </RBButton>
        )}
        {resendAvailable(type, status) && (
          <RBButton
            modifiers={['text']}
            category="secondary"
            onClick={onSend}
            disabled={!canSend}
          >
            {getSendButtonTitle(type, true)}
          </RBButton>
        )}
        {editDetailsAvailable(type, status) && (
          <RBButton
            href={`/product/consignment/${id}/editDetails`}
            modifiers={['text']}
            category="secondary"
          >
            Edit Details
          </RBButton>
        )}
        {receiveAvailable(type, status) && (
          <RBButton
            href={`/product/consignment/${id}/receive`}
            modifiers={['text']}
            category="secondary"
          >
            Receive
          </RBButton>
        )}
        {/* {importAvailable(status) && (
                    <RBButton href={`/product/consignment/${id}/importProducts`} modifiers={['text']} category='secondary'>Import Products</RBButton>
                )} */}
        {sendAvailable(status) && (
          <RBButton
            modifiers={['text']}
            category="secondary"
            onClick={onSend}
            disabled={!canSend}
          >
            {getSendButtonTitle(type)}
          </RBButton>
        )}
        {/* <RBButton modifiers={['text']} category='secondary' onClick={onExport}>Export CSV</RBButton> */}
        {markAsSentAvailable(status) && (
          <RBButton
            modifiers={['text']}
            category="secondary"
            onClick={onMarkAsSent}
            disabled={!canSend}
          >
            Mark as Sent
          </RBButton>
        )}
      </RBButtonGroup>
      <RBButtonGroup>
        {cancelAvailable(type, status) && (
          <RBButton modifiers={['ghost']} onClick={onCancel}>
            {getCancelButtonTitle(type)}
          </RBButton>
        )}
      </RBButtonGroup>
    </RBFlex>
  </RBSection>
);

export default ActionBar;
