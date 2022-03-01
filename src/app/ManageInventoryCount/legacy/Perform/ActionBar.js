import React from 'react';
import STATES from '../../../../constants/states';
import { RBSection, RBFlex, RBButton } from '../../../../rombostrap';

const ActionBar = ({
  onlineStatus,
  lastSaved,
  stateSaving,
  showFailed,
  failed,
  onPause,
  onReview
}) => (
  <RBSection type="secondary">
    <RBFlex flex flexAlign="center" flexJustify="between">
      <div>
        Count your inventory in this outlet to ensure your inventory is correct.
      </div>
      <div className="vd-mrm" style={{ whiteSpace: 'nowrap' }}>
        {onlineStatus && (
          <span className="vd-text--sub vd-mrm vd-mlm">
            {lastSaved &&
              stateSaving !== STATES.inProgress && (
                <span>
                  Last saved
                  {showFailed &&
                    failed && (
                      <span className="vd-text--negative vd-plm">
                        ({failed} failed to save)
                      </span>
                    )}
                </span>
              )}
            {stateSaving === STATES.inProgress && <span>Saving...</span>}
          </span>
        )}
        {!onlineStatus && (
          <span>
            <span className="vd-text--negative">Offline</span>
            <span className="vd-text-secondary">
              <span>items not synced</span>
            </span>
          </span>
        )}
        <RBButton
          category="secondary"
          disabled={!onlineStatus || stateSaving === STATES.inProgress}
          onClick={onPause}
        >
          Pause
        </RBButton>
        <RBButton
          category="secondary"
          disabled={!onlineStatus || stateSaving === STATES.inProgress}
          onClick={onReview}
        >
          Review
        </RBButton>
      </div>
    </RBFlex>
  </RBSection>
);

export default ActionBar;
