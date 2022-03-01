import React from 'react';
import ReportMetric from './ReportMetric';

const OutletPerformanceMetrics = ({ data }) => (
  <div>
    <ReportMetric
      label="Average Sale Value"
      metric="basketValue"
      average={true}
      format="currency"
      data={data.reportData}
      classes="vd-mbxl"
    />
    <ReportMetric
      label="Average Items Per Sale"
      metric="basketSize"
      average={true}
      data={data.reportData}
    />
  </div>
);

export default OutletPerformanceMetrics;
