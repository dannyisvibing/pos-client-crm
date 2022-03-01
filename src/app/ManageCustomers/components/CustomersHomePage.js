import React from 'react';
import { logRender } from '../../../utils/debug';
import '../styles/common.css';
import { RBHeader, RBSection, RBFlex } from '../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import CustomersFilter from '../containers/CustomersFilterContainer';
import CustomersTable from '../containers/CustomersTableContainer';

const CustomersHomePage = () => {
  logRender('render CustomersHomePage');
  return (
    <div className="customers-page-container">
      <RBSection>
        <RBHeader category="page">Customers</RBHeader>
      </RBSection>
      <RBSection type="secondary">
        <RBFlex flex flexJustify="between" flexAlign="center">
          <span className="vd-mrl">
            Manage your customers and their balances, or segment them by
            demographics and spending habits.
          </span>
          <RBButtonGroup>
            <RBButton href="/customer/import" category="secondary">
              Import
            </RBButton>
            <RBButton href="/customer/add" category="primary">
              Add Customer
            </RBButton>
          </RBButtonGroup>
        </RBFlex>
      </RBSection>
      <CustomersFilter />
      <RBSection>
        <CustomersTable />
      </RBSection>
    </div>
  );
};

export default CustomersHomePage;
