import React from 'react';
import RBSection, {
  RBSectionActionBar
} from '../../../../rombostrap/components/RBSection';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';

const ActionBar = ({
  create,
  type,
  target,
  formState,
  onDelete,
  onSave,
  onSaveAndSend,
  onSaveAndReceive
}) => (
  <RBSection type="action-bar">
    <RBSectionActionBar type="about">
      <div />
    </RBSectionActionBar>
    <RBSectionActionBar type="actions">
      {create ? (
        <RBButton category="primary" onClick={onSave}>
          Save
        </RBButton>
      ) : (
        <RBButtonGroup>
          {target === 'details' &&
            type !== 'outletTransfer' && (
              <RBButton category="primary" onClick={onDelete}>
                Delete
              </RBButton>
            )}
          <RBButton
            category="primary"
            onClick={onSave}
            disabled={formState.invalid}
          >
            Save
          </RBButton>
          {target === 'entire' && (
            <RBButton
              category="primary"
              onClick={onSaveAndSend}
              disabled={formState.invalid}
            >
              Save and Send
            </RBButton>
          )}
          {target === 'receive' && (
            <RBButton
              category="primary"
              onClick={onSaveAndReceive}
              disabled={formState.invalid}
            >
              Save and Receive
            </RBButton>
          )}
        </RBButtonGroup>
      )}
    </RBSectionActionBar>
  </RBSection>
);

export default ActionBar;
