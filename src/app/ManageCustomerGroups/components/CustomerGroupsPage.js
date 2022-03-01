import React from 'react';
import PropTypes from 'prop-types';
import { logRender } from '../../../utils/debug';
import { RBHeader, RBSection, RBFlex } from '../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import CustomerGroupsTable from '../containers/CustomerGroupsTableContainer';
import ModalTypes from '../../../constants/modalTypes';

const CustomerGroupsPage = props => {
  logRender('render CustomerGroupsPage');
  return (
    <div className="customers-page-container">
      <RBSection>
        <RBHeader category="page">Customer Groups</RBHeader>
      </RBSection>
      <RBSection type="secondary">
        <RBFlex flex flexJustify="between" flexAlign="center">
          <span className="vd-mrl">
            Group customers for reporting and promotional pricing using Price
            Books.
          </span>
          <RBButtonGroup>
            <RBButton
              href=""
              category="primary"
              onClick={e => {
                e.preventDefault();
                props.openModal({ type: ModalTypes.CUSTOMER_GROUP });
              }}
            >
              Add Group
            </RBButton>
          </RBButtonGroup>
        </RBFlex>
      </RBSection>
      <RBSection>
        <CustomerGroupsTable />
      </RBSection>
    </div>
  );
};

const { func } = PropTypes;
CustomerGroupsPage.propTypes = {
  openModal: func.isRequired
};

export default CustomerGroupsPage;
