import React from 'react';
import { connect } from 'react-redux';
import OutletSelect from '../OutletSelect';
import { RBHeader, RBField, RBP } from '../../../../../rombostrap';
import { RBLabel } from '../../../../../rombostrap/components/RBField';
import { outletsSelector } from '../../../../../modules/outlet';
import nameForMultipleOutletIds from '../../../utils/nameForMultipleOutletIds';

const Outlets = ({
  user,
  outlets,
  canManageOutlets,
  onOutletIdsSelected,
  getOutletsNames
}) => (
  <div>
    <RBHeader category="settings">Outlets</RBHeader>
    <div className="vd-g-row">
      <div className="vd-g-col vd-g-s-12 vd-g-m-3 vd-grid-settings-item">
        <RBP>Outlets that this user is assigned to and can work in.</RBP>
      </div>
      <div className="vd-g-col vd-g-s-12 vd-g-m-9">
        {!canManageOutlets && (
          <RBP>{getOutletsNames(user.restrictedOutletIds)}</RBP>
        )}
        {canManageOutlets && (
          <RBField short>
            <RBLabel>Outlets</RBLabel>
            <OutletSelect
              user={user}
              outlets={outlets}
              onOutletIdsSelected={onOutletIdsSelected}
            />
          </RBField>
        )}
      </div>
    </div>
  </div>
);

export default connect(state => ({
  getOutletsNames(outletIds, maxOutlets) {
    return nameForMultipleOutletIds(
      outletsSelector(state),
      outletIds,
      maxOutlets
    );
  }
}))(Outlets);
