import React from 'react';
import { Header, Tabs } from '../../common/legacy/Basic';
import { RBSection } from '../../../rombostrap';

export const TipComponent = ({ children }) => (
  <RBSection type="secondary">{children}</RBSection>
);
TipComponent.displayName = 'tip';

export const HeaderComponent = ({ children }) => (
  <RBSection type="tertiary">{children}</RBSection>
);
HeaderComponent.displayName = 'header';

export const BodyComponent = ({ children }) => (
  <RBSection classes="vd-tab-body">{children}</RBSection>
);
BodyComponent.displayName = 'body';

export const TabLayout = ({ children }) => (
  <div className="vd-tab-body">
    {React.Children.map(
      children,
      (child, index) => child.type.displayName === 'tip' && child
    )}
    {React.Children.map(
      children,
      (child, index) => child.type.displayName === 'header' && child
    )}
    {React.Children.map(
      children,
      (child, index) => child.type.displayName === 'body' && child
    )}
  </div>
);
TabLayout.displayName = 'tablayout';

const PrimaryLayout = ({
  title,
  tabs,
  activeTabIndex = 0,
  onChangeTab,
  children
}) => (
  <div className="vd-primary-layout">
    <RBSection>
      <Header page>{title}</Header>
    </RBSection>
    <RBSection classes="vd-pbn">
      {tabs &&
        tabs.length > 1 && (
          <Tabs
            activeTabIndex={activeTabIndex}
            onChange={onChangeTab}
            noBorder
            tabs={tabs}
          />
        )}
    </RBSection>
    {children &&
    React.Children.map(
      children,
      child => child.type.displayName === 'tablayout'
    ).findIndex(ele => ele === false) === -1 ? (
      React.Children.toArray(children)[activeTabIndex]
    ) : children &&
    React.Children.map(
      children,
      child =>
        child.type.displayName === 'tip' ||
        child.type.displayName === 'header' ||
        child.type.displayName === 'body'
    ).findIndex(ele => ele === false) === -1 ? (
      <TabLayout>{children}</TabLayout>
    ) : (
      children
    )}
  </div>
);

export default PrimaryLayout;
