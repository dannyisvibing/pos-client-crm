import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent
} from '../../../rombostrap/components/RBDialog';
import { RBHeader, RBTabs, RBTab } from '../../../rombostrap';

function getRegisterStatus(register) {
  if (register.openingClosureId) {
    return 'Opened';
  } else {
    return 'Closed';
  }
}

const SelectRegisterDialog = props => {
  const {
    isOpen,
    selectedOutletId,
    selectOutlet,
    outlets,
    registers,
    currentRegister,
    onRequestClose,
    onSelectRegister
  } = props;

  const outletRegisters = _.filter(registers, { outletId: selectedOutletId });

  return (
    <RBDialog size="large" open={isOpen} onRequestClose={onRequestClose}>
      <RBDialogHeader>
        <RBHeader category="dialog">Select Register</RBHeader>
      </RBDialogHeader>
      <RBDialogContent>
        <RBTabs
          activeValue={selectedOutletId}
          onClick={(e, id) => selectOutlet(id)}
        >
          {outlets.map(outlet => (
            <RBTab key={outlet.outletId} value={outlet.outletId}>
              {outlet.outletName}
            </RBTab>
          ))}
        </RBTabs>
        <div className="wr-cards vd-mtm">
          {outletRegisters.map(register => (
            <button
              key={register.registerId}
              className={classnames('wr-card', {
                'wr-card--active':
                  register.registerId === currentRegister.registerId
              })}
              onClick={() => onSelectRegister(register.registerId)}
            >
              <div className="wr-card-content">
                <h3 className="wr-card-value">{register.registerName}</h3>
                <div className="wr-card-value-status">
                  {getRegisterStatus(register)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </RBDialogContent>
    </RBDialog>
  );
};

export default SelectRegisterDialog;
