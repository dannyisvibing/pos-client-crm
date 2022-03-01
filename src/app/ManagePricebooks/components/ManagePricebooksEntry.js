import React from 'react';
import PropTypes from 'prop-types';
import PricebooksHome from '../containers/PricebooksHomePageContainer';
import CRUDPricebooks from '../containers/CRUDPricebooksPageContainer';
import ViewPricebooks from '../containers/ViewPricebooksPageContainer';
import { MANAGE_PRICEBOOKS } from '../../../constants/pageTags';
import { logRender } from '../../../utils/debug';

const ManagePricebooksEntry = ({ page }) => {
  logRender('render Manage Pricebooks Entry');
  return page.tag === MANAGE_PRICEBOOKS.HOME ? (
    <PricebooksHome />
  ) : page.tag === MANAGE_PRICEBOOKS.CRUD ? (
    <CRUDPricebooks params={page.props} />
  ) : page.tag === MANAGE_PRICEBOOKS.VIEW ? (
    <ViewPricebooks params={page.props} />
  ) : (
    <div />
  );
};

const { object } = PropTypes;
ManagePricebooksEntry.propTypes = {
  page: object.isRequired
};

export default ManagePricebooksEntry;
