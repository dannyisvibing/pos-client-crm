import React from 'react';
import { NavLink } from 'react-router-dom';
import ReactTable from '../../common/components/BaseTable';

const columns = [
  {
    Header: 'Ouetlet Name',
    accessor: 'outletName'
  },
  {
    Header: 'Default Sales Tax',
    accessor: 'tax'
  },
  {
    Header: '',
    Cell: row => {
      return (
        <NavLink to={`/setup/outlet/edit/${row.original.outletId}`}>
          Edit Outlet
        </NavLink>
      );
    }
  }
];

const OutletDefaultTaxTable = ({ defaultTaxData }) => (
  <ReactTable
    columns={columns}
    data={defaultTaxData}
    options={{
      showPagination: false,
      minRows: 1
    }}
  />
);

export default OutletDefaultTaxTable;
