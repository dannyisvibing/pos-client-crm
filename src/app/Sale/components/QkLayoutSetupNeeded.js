import React from 'react';
import { RBButton } from '../../../rombostrap';

const QkLayoutSetupNeeded = () => {
  return (
    <div className="wr-workspace-quickkey-setup wr-workspace-quickkey-setup-row wr-workspace-quickkey-setup-default">
      <div className="vd-header vd-header--page">Quick Keys</div>
      <div className="wr-workspace-quickkey-splash-default-content">
        <div className="vd-text--secondary">
          Create custom buttons or Quick Keys for your most popular products,
          and speed up checkouts
        </div>
      </div>
      <div className="wr-workspace-quickkey-setup-actions vd-mtl">
        <RBButton href="/webregister/settings" category="secondary">
          Set up Quick Keys now
        </RBButton>
      </div>
    </div>
  );
};

export default QkLayoutSetupNeeded;
