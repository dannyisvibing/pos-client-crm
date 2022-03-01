import React from 'react';
import { RBHeader, RBLink } from '../../../rombostrap';

const WebRegisterSideTopBar = props => {
  const { isOnline, currentRegister, getOutletById } = props;
  let outlet = { outletName: 'Loading...' };
  let register = { registerName: 'Loading...' };
  if (currentRegister) {
    outlet = getOutletById(currentRegister.outletId) || outlet;
    register = currentRegister;
  }
  return (
    <div className="register-info">
      <RBHeader category="section">{register.registerName}</RBHeader>
      <div className="vd-text-supplementary">
        <span>{outlet.outletName}</span>
      </div>
      {isOnline && (
        <div className="register-info-outlet-actions vd-text-supplementary vd-mtm">
          <RBLink
            isNavLink={false}
            href=""
            secondary
            onClick={e => {
              e.preventDefault();
              props.onClickSwitch();
            }}
          >
            Switch
          </RBLink>
        </div>
      )}
    </div>
  );
};

export default WebRegisterSideTopBar;
