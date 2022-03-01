import React from 'react';
import PrimaryContentLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import DescriptionSection from '../../common/components/DescriptionSection';
import { RBButton, RBSwitch } from '../../../rombostrap';
import QkLayout from './QkLayout';
import '../styles/SaleSettingsPage.css';

const SaleSettingsPage = props => {
  const {
    qkLayouts,
    getCurrentRegister,
    onEnableQuickKey,
    onAddNewLayout,
    onSetActive,
    onEditLayout,
    onDuplicateLayout,
    onRemoveLayout
  } = props;
  return (
    <PrimaryContentLayout title="Settings">
      <TipComponent>
        <span>Manage your register settings</span>
      </TipComponent>
      <BodyComponent>
        <DescriptionSection
          title="Quick Keys"
          description="Assign products as Quick Keys to help process sales faster. Rename, reposition and recolor keys, or organize your buttons into folders and pages"
        >
          <div className="wr-media wr-media--center vd-mbxl">
            <div className="wr-media-object">
              <RBSwitch
                checked={getCurrentRegister().qklayoutEnabled}
                onChange={onEnableQuickKey}
              />
            </div>
            <div className="wr-media-body">
              <div className="vd-header vd-mbs">
                Enable Quick Keys for this register.
              </div>
              <p className="vd-p vd-text--sub">
                Toggle the switch to enable your Quick Keys for your register.
                You can turn this back on at anytime without losing your
                settings.
              </p>
            </div>
          </div>
          <RBButton category="primary" onClick={onAddNewLayout}>
            Add new layout
          </RBButton>
          {qkLayouts.map(qkLayout => (
            <QkLayout
              key={qkLayout.qkLayoutId}
              layoutName={qkLayout.qkLayoutName}
              usedCount={0}
              currentLayout={
                qkLayout.qkLayoutId === getCurrentRegister().currentQklayoutId
              }
              onSetAsCurrentLayout={() => onSetActive(qkLayout)}
              onEdit={() => onEditLayout(qkLayout)}
              onCopy={() => onDuplicateLayout(qkLayout)}
              onRemove={() => onRemoveLayout(qkLayout)}
            />
          ))}
        </DescriptionSection>
      </BodyComponent>
    </PrimaryContentLayout>
  );
};

export default SaleSettingsPage;
