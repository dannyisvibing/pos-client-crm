import React from 'react';
import LegacyManageConsignmentsEntry from '../legacy';
import { logRender } from '../../../utils/debug';

const ManageConsignmentsEntry = props => {
  logRender('render Manage Consignments Entry');
  return <LegacyManageConsignmentsEntry {...props} />;
};

export default ManageConsignmentsEntry;
