import React from 'react';
import { Button, Flag } from '../../common/legacy/Basic';

const WRQKLayoutItem = ({
  layoutName,
  usedCount,
  currentLayout,
  onSetAsCurrentLayout,
  onEdit,
  onCopy,
  onRemove
}) => (
  <ul className="wr-qk-layouts">
    <li className="wr-qk-layout">
      <div className="wr-qk-layout-about">
        <span className="vd-header wr-qk-layout-title">{layoutName}</span>
        {usedCount > 0 && (
          <div className="vd-text--sub vd-mts">
            Used by {usedCount} other registers
          </div>
        )}
      </div>
      <div className="wr-qk-layout-actions">
        {currentLayout ? (
          <Flag classes="vd-mrl">Current Layout</Flag>
        ) : (
          <Button
            unnested
            secondary
            classes="vd-mrl vd-mln"
            onClick={onSetAsCurrentLayout}
          >
            Set as Current Layout
          </Button>
        )}
        <Button
          faIcon="fa fa-pencil"
          secondary
          unnested
          classes={{ root: 'vd-mls vd-mrs' }}
          onClick={onEdit}
        />
        <Button
          faIcon="fa fa-files-o"
          secondary
          unnested
          classes={{ root: 'vd-mls vd-mrs' }}
          onClick={onCopy}
        />
        <Button
          faIcon="fa fa-trash"
          secondary
          unnested
          classes={{ root: 'vd-mls vd-mrs' }}
          onClick={onRemove}
        />
      </div>
    </li>
  </ul>
);

export default WRQKLayoutItem;
