import React from 'react';
import LegacyPage from '../legacy/CRUDProductsPage';
import { logRender } from '../../../utils/debug';

const CRUDProductsPage = props => {
  logRender('render CRUDProductsPage');
  return <LegacyPage {...props} />;
};

export default CRUDProductsPage;
