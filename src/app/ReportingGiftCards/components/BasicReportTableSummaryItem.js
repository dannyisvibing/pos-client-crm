import React from 'react';

const BasicTableSummaryItem = ({ label, value }) => (
  <table className="vd-table">
    <tbody>
      <tr>
        <td className="vd-header vd-no-pad-l">{label}</td>
        <td className="vd-no-pad-r vd-align-right vd-tight">{value}</td>
      </tr>
    </tbody>
  </table>
);

export default BasicTableSummaryItem;
