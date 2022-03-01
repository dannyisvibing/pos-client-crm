import React from 'react';
import LegacyManageInventoryCountEntry from '../legacy';
import { logRender } from '../../../utils/debug';

const ManageInventoryCountEntry = props => {
  logRender('render ManageInventoryCountEntry');
  return <LegacyManageInventoryCountEntry {...props} />;
};

export default ManageInventoryCountEntry;
