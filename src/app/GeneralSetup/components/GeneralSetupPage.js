import React from 'react';
import { RBSection, RBHeader } from '../../../rombostrap';
import StoreSettings from '../containers/StoreSettingsContainer';
import ContactInformation from '../containers/ContactInformationContainer';
import Address from '../containers/AddressContainer';

const GeneralSetupPage = () => {
  return (
    <div>
      <RBSection>
        <RBHeader category="page">General Setup</RBHeader>
      </RBSection>
      <RBSection classes="vd-mtl">
        <StoreSettings />
        <hr className="vd-hr" />
        <ContactInformation />
        <hr className="vd-hr" />
        <Address />
      </RBSection>
    </div>
  );
};

export default GeneralSetupPage;
