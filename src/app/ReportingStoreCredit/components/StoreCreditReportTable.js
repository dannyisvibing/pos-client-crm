import React from 'react';
import { RBSection } from '../../../rombostrap';
import StoreCreditReportSummary from './StoreCreditReportSummary';
import withCurrencyFormat from '../../common/containers/WithCurrencyFormatter';

const StoreCreditReportTable = props => {
  const { storeCreditData, formatCurrency } = props;
  return (
    <RBSection>
      <StoreCreditReportSummary />
      <table className="vd-table vd-table--compact vd-table--fixed vd-table--report vd-table--expandable">
        <thead>
          <tr>
            <th>Customer</th>
            <th className="vd-align-right">Total issued</th>
            <th className="vd-align-right">Total redeemed</th>
            <th className="vd-align-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {storeCreditData.waiting && <tr>Loading...</tr>}
          {!storeCreditData.storeCreditRecords.length &&
            !storeCreditData.waiting && (
              <tr className="vd-inactive">
                <td colSpan="4">No store credit data available</td>
              </tr>
            )}
          {!!storeCreditData.storeCreditRecords.length &&
            storeCreditData.storeCreditRecords.map((storeCreditRecord, i) => (
              <tr key={i} className="vd-expandable">
                <td>
                  <a className="vd-link">
                    {this.getCustomerName(storeCreditRecord.customer)}
                  </a>
                </td>
                <td className="vd-align-right">
                  {formatCurrency(storeCreditRecord.totalCreditIssued)}
                </td>
                <td className="vd-align-right">
                  {formatCurrency(storeCreditRecord.totalCreditRedeemed)}
                </td>
                <td className="vd-align-right">
                  {formatCurrency(storeCreditRecord.balance)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </RBSection>
  );
};

StoreCreditReportTable.defaultProps = {
  storeCreditData: {
    storeCreditTotals: {
      totalValueIssued: 0,
      totalValueRedeemed: 0,
      outstandingBalance: 0
    },
    storeCreditRecords: []
  }
};

export default withCurrencyFormat(StoreCreditReportTable);
