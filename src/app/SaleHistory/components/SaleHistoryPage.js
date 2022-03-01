import React from 'react';
import { RBSection, RBHeader, RBTabs, RBTab } from '../../../rombostrap';
import SalesHistoryFilter from '../containers/SalesHistoryFilterContainer';
import SalesHistoryTable from '../containers/SalesHistoryTableContainer';

const SaleHistoryPage = props => {
  const { activeCategory } = props;
  return (
    <div className="vd-primary-layout">
      <RBSection>
        <RBHeader category="page">Sales History</RBHeader>
      </RBSection>
      <RBSection classes="vd-pbn">
        <RBTabs
          modifiers={['no-border', 'large']}
          activeValue={activeCategory}
          onClick={props.onSelectCategory}
        >
          <RBTab value="continue_sales">Continue sales</RBTab>
          <RBTab value="process_returns">Process returns</RBTab>
          <RBTab value="all_sales">All Sales</RBTab>
        </RBTabs>
      </RBSection>
      <RBSection type="secondary">
        Continue processing a layby, On Account, and parked sale, or print and
        email receipts.
      </RBSection>
      <RBSection type="tertiary">
        <SalesHistoryFilter statusCategory={activeCategory} />
      </RBSection>
      <RBSection>
        <SalesHistoryTable />
      </RBSection>
    </div>
  );
};

export default SaleHistoryPage;
