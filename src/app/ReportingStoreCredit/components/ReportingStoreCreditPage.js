import React from 'react';
import { RBSection, RBHeader } from '../../../rombostrap';
import StoreCreditReportTable from './StoreCreditReportTable';

const ReportingStoreCreditPage = () => {
  return (
    <div>
      <RBSection>
        <RBHeader category="page">Store Credit Report</RBHeader>
        <StoreCreditReportTable />
      </RBSection>
    </div>
  );
};

export default ReportingStoreCreditPage;
