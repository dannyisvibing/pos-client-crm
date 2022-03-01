import React from 'react';
import { RBSection, RBFlex } from '../../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';

const ActionBar = ({ isSaving, isStarting, onSave, onStart }) => (
  <div>
    <RBSection type="secondary">
      <RBFlex flex flexJustify="between" flexAlign="center">
        <div className="action-bar-description">
          Schedule a full or partial inventory count to maintain accurate
          inventory levels.
        </div>
        <RBButtonGroup>
          <RBButton
            category="secondary"
            disabled={isSaving || isStarting}
            onClick={onSave}
          >
            Save & Exit
            {isSaving && (
              <i className="vd-loader vd-loader--small vd-loader--background" />
            )}
          </RBButton>
          <RBButton
            category="primary"
            disabled={isSaving || isStarting}
            onClick={onStart}
          >
            Start Count
            {isStarting && (
              <i className="vd-loader vd-loader--small vd-loader--background" />
            )}
          </RBButton>
        </RBButtonGroup>
      </RBFlex>
    </RBSection>
  </div>
);

export default ActionBar;
