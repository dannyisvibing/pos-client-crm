import React from 'react';
import { NavLink } from 'react-router-dom';

const OutletNRegisterTable = ({ data = [], details, onMoreFewerDetails }) => (
  <table className="item_list table-padded no-stripe table-fixed">
    <thead>
      <tr>
        <th width="17%">Outlet Name</th>
        <th width="17%">Default Tax</th>
        <th width="14%">Registers</th>
        <th width="8%">Status</th>
        <th width="24%">Details</th>
        <th width="20%" />
      </tr>
    </thead>
    <tbody>
      {data.reduce((memo, outletRow) => {
        memo.push(
          <tr key={memo.length} className="section-header">
            <td className="strong">
              <NavLink to={outletRow.outletLink}>{outletRow.name}</NavLink>
            </td>
            <td>{outletRow.defaultTax}</td>
            <td colSpan="3" />
            <td>
              <ul className="action line">
                <li className="unit">
                  <NavLink to={outletRow.editOutletLink}>Edit Outlet</NavLink>
                </li>
                <li className="unit">
                  <NavLink to={outletRow.addRegisterLink}>
                    Add a Register
                  </NavLink>
                </li>
              </ul>
            </td>
          </tr>
        );

        outletRow.registers.forEach(register => {
          memo.push(
            <tr key={memo.length} className="last">
              <td className="blank" colSpan="2" />
              <td className="txtT">
                <NavLink to={register.registerLink}>{register.name}</NavLink>
              </td>
              <td className="txtT">{register.status}</td>
              <td className="txtT">
                <ul className="table-nested">
                  <li>{register.receiptTemplateName}</li>
                  <li>{`Invoice ${register.receiptPrefix ||
                    ''}${register.receiptNumber ||
                    ''}${register.receiptSuffix || ''}`}</li>
                  <li>
                    {register.selectUserForNextSale
                      ? 'Select user for next sale'
                      : "Don't select user for next sale"}
                  </li>
                  {!!details[register.registerId] && (
                    <div>
                      {!!register.emailReceipt && <li>Email receipt</li>}
                      {!!register.printReceipt && <li>Print receipt</li>}
                      {register.askForNote === 'on-some' && (
                        <li>Ask for note on save / layby / on account sales</li>
                      )}
                      {register.askForNote === 'on-all' && (
                        <li>Ask for note on all sales</li>
                      )}
                      {!!register.printNoteOnReceipt && (
                        <li>Print note on receipt</li>
                      )}
                      {!!register.showDiscountsOnReceipt && (
                        <li>Show Discounts On Receipt</li>
                      )}
                    </div>
                  )}
                  <a
                    href=""
                    onClick={e => onMoreFewerDetails(e, register.registerId)}
                  >
                    {!!details[register.registerId] ? 'Fewer' : 'More'} details
                  </a>
                </ul>
              </td>
              <td className="txtT">
                <NavLink to={register.editRegisterLink}>Edit register</NavLink>
              </td>
            </tr>
          );
        });

        return memo;
      }, [])}
    </tbody>
  </table>
);

export default OutletNRegisterTable;
