import React from 'react';
import Selectize from '../../common/legacy/Selectize';
import displayRound from '../../../utils/displayRound';

const TaxTable = props => {
  const { data = [], taxOptions = [], retailPrice, onChangeTax } = props;
  return (
    <div>
      <div className="vd-header vd-header--section">Tax Settings</div>
      <table className="vd-table vd-table--compact">
        <thead>
          <tr>
            <th className="vd-no-pad-l">
              {/* isTaxInclusive */}
              {/* !isTaxInclusive */}
              <div>Outlet</div>
            </th>
            <th>Sales Tax Name</th>
            <th className="vd-align-right">Tax Rate</th>
            <th className="vd-align-right">Tax Amount</th>
            <th className="vd-align-right">
              Retail Price
              <div>
                <i className="vd-text--sub">(Including tax)</i>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* isTaxInclusive */}
          {/* !isTaxInclusive variant.outlets*/}
          {data.map((line, i) => (
            <tr key={i} className="vd-no-border-b">
              <td className="vd-no-pad-l">{line.outletName}</td>
              <td>
                <Selectize
                  value={line.saleTaxId}
                  options={taxOptions}
                  onChange={tax => onChangeTax(line.outletId, tax)}
                />
              </td>
              <td>{displayRound(line.rate)}</td>
              <td>{displayRound(retailPrice / 100 * line.rate)}</td>
              <td>
                {displayRound(retailPrice + retailPrice / 100 * line.rate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaxTable;
