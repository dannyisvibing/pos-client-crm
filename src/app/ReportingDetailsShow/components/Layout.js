import React from 'react';

export const ReportControls = ({ children }) => (
  <div className="row report-controls">{children}</div>
);
ReportControls.displayName = 'controls';

export const ReportFilter = ({ children }) => (
  <section className="row report-controls">{children}</section>
);
ReportFilter.displayName = 'filter';

export const DisplayOption = ({ children }) => (
  <div className="row display-option-row">{children}</div>
);
DisplayOption.displayName = 'display';

export const DataTable = ({ children }) => (
  <section className="datatable-container">
    <div className="row">{children}</div>
  </section>
);
DataTable.displayName = 'table';

const ReportContent = ({ label, children }) => (
  <div className="vd-page-report-layout">
    <section>
      <section>
        <div className="row report-type-row">
          <span className="report-type-heading">{label}</span>
        </div>
        {React.Children.map(
          children,
          child =>
            child &&
            (child.type.displayName === 'controls' ||
              child.type.displayName === 'filter') &&
            child
        )}
      </section>
      {React.Children.map(
        children,
        child => child && child.type.displayName === 'display' && child
      )}
    </section>
    {React.Children.map(
      children,
      child => child && child.type.displayName === 'table' && child
    )}
  </div>
);

export default ReportContent;
