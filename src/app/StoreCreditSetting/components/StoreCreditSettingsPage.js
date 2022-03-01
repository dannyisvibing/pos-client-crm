import React from 'react';
import PrimaryLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { Switch } from '../../common/legacy/Basic';

const StoreCreditSettingsPage = ({ retailerSettings, onEnableStoreCredit }) => {
  return (
    <PrimaryLayout title="Store Credit">
      <TipComponent>
        <div>Manage whether your stores offer store credit.</div>
      </TipComponent>
      <BodyComponent>
        <div className="vd-g-row">
          <div className="vd-g-col vd-g-s-12 vd-g-m-3">Enable Store Credit</div>
          <div className="vd-g-col vd-g-s-12 vd-g-m-9">
            <Switch
              checked={retailerSettings.storeCreditEnabled}
              onChange={onEnableStoreCredit}
            />
            <div className="vd-ptl">
              Enable issuing store credit in my store
              <div className="vd-p vd-pts vd-text--sub vd-text--secondary">
                Disabling store credit will mean you can no longer issue store
                credit or pay by store credit.
              </div>
            </div>
          </div>
        </div>
      </BodyComponent>
    </PrimaryLayout>
  );
};

export default StoreCreditSettingsPage;
