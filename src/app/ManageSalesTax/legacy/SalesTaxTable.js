import React from 'react';
import ReactTable from '../../common/components/BaseTable';
import { A } from '../../common/legacy/Basic';

const SalesTaxTable = ({ salestax, onEdit, onDelete }) => (
  <ReactTable
    columns={[
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Rate',
        accessor: 'rate'
      },
      {
        Header: '',
        Cell: row =>
          row.original.id ? (
            <ul className="action line">
              <li className="unit">
                <A
                  title="Edit"
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    onEdit(e, row.original.id);
                  }}
                />
              </li>
              <li className="unit">
                <A
                  title="Delete"
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    onDelete(e, row.original.id);
                  }}
                />
              </li>
            </ul>
          ) : (
            undefined
          )
      }
    ]}
    data={[{ name: 'No Tax', rate: '0%' }].concat(
      salestax.map(tax => {
        return {
          id: tax.id,
          name: tax.name,
          rate: `${tax.rate}%`
        };
      })
    )}
    options={{
      showPagination: false,
      minRows: 1
    }}
  />
);

export default SalesTaxTable;
