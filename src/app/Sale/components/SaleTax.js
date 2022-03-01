import React from 'react';
import { Button, Header } from '../../common/legacy/Basic';

const RemoveTaxFromSale = ({ taxBreakdown, onRemove }) => (
  <div>
    <Header section>Remove tax from sale</Header>
    <hr className="vd-hr vd-mbn" />
    <table className="wr-sale-tax-breakdown-table">
      <tbody>
        {taxBreakdown.map((tax, i) => (
          <tr key={i} className="wr-sale-tax-breakdown-tax-item">
            <td>
              <span>{`${tax.name} (${tax.rate}%)`}</span>
            </td>
            <td className="wr-sale-tax-breakdown-tax-total">
              {`$${tax.taxAmount}`}
            </td>
            <td className="wr-sale-tax-breakdown-tax-actions">
              <Button
                negative
                faIcon="fa fa-trash"
                onClick={() => onRemove(tax)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="vd-button-group vd-mtm" />
  </div>
);

export default RemoveTaxFromSale;
