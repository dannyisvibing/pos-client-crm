import React from 'react';
import classnames from 'classnames';
import withCurrencyFormat from '../../common/containers/WithCurrencyFormatter';

const BasicReportTableSummaryItem = ({
  name,
  valueIsCurrency,
  value,
  lastRow,
  formatCurrency
}) => (
  <table className="vd-table">
    <tbody>
      <tr
        className={classnames({
          'vd-no-border-b': lastRow
        })}
      >
        <td className="vd-header vd-no-pad-l">{name}</td>
        {valueIsCurrency && (
          <td className="vd-no-pad-r vd-align-right vd-tight">
            {formatCurrency(value)}
          </td>
        )}
        {!valueIsCurrency && (
          <td className="vd-no-pad-r vd-align-right vd-tight">{value}</td>
        )}
      </tr>
    </tbody>
  </table>
);

export default withCurrencyFormat(BasicReportTableSummaryItem);
