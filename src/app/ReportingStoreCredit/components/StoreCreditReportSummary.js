import React from 'react';
import { RBSection, RBFlex } from '../../../rombostrap';
import BasicReportTableSummaryItem from './BasicReportTableSummaryItem';

const StoreCreditReportSummary = ({ storeCreditData }) => (
  <RBSection>
    <RBFlex flex>
      <div className="vd-col-6 vd-prl">
        <BasicReportTableSummaryItem
          name="Total Value Issued"
          valueIsCurrency={true}
          value={storeCreditData.storeCreditTotals.totalValueIssued}
        />
      </div>
      <div className="vd-col-6 vd-pll">
        <BasicReportTableSummaryItem
          name="Total Value Redeemed"
          valueIsCurrency={true}
          value={storeCreditData.storeCreditTotals.totalValueRedeemed}
        />
      </div>
    </RBFlex>
    <RBFlex flex>
      <div className="vd-col-6 vd-prl">
        <BasicReportTableSummaryItem
          name="Outstanding Balance"
          valueIsCurrency={true}
          value={storeCreditData.storeCreditTotals.outstandingBalance}
          lastRow={true}
        />
      </div>
      <div className="vd-col-6 vd-pll" />
    </RBFlex>
  </RBSection>
);

StoreCreditReportSummary.defaultProps = {
  storeCreditData: {
    storeCreditTotals: {
      totalValueIssued: 0,
      totalValueRedeemed: 0,
      outstandingBalance: 0
    }
  }
};

export default StoreCreditReportSummary;
