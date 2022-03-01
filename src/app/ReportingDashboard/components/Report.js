import React from 'react';
import Spinner from './Spinner';
import ReportChart from './ReportChart';

const Report = ({ type, view, period }) => (
  <div>
    <Spinner loading={view.datatable.loading} />
    {!view.datatable.loading && (
      <div>
        {type === 'chart' && <ReportChart view={view} />}
        {type === 'bar' && <div />}
        {type === 'product-table' && <div />}
        {type === 'user-table' && <div />}
        {type === 'sales-table' && <div />}
      </div>
    )}
  </div>
);

export default Report;
