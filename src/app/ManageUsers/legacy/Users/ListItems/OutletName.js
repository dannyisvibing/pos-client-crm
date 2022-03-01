import React from 'react';
import { connect } from 'react-redux';
import { RBTD } from '../../../../../rombostrap/components/RBTable/RBTable';
import nameForMultipleOutletIds from '../../../utils/nameForMultipleOutletIds';
import { outletsSelector } from '../../../../../modules/outlet';

const OutletName = ({ user, getOutletsNames }) => (
  <RBTD classes="vd-sml-pad-h pro-user-outlet">
    {getOutletsNames(user.restrictedOutletIds)}
  </RBTD>
);

export default connect(state => ({
  getOutletsNames(outletIds, maxOutlets) {
    return nameForMultipleOutletIds(
      outletsSelector(state),
      outletIds,
      maxOutlets
    );
  }
}))(OutletName);
