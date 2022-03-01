import React from 'react';
import ReactTable from '../../common/components/BaseTable';

const RegisterClosuresTable = ({ data }) => (
  <ReactTable
    columns={[
      {
        Header: 'Register',
        accessor: 'register'
      },
      {
        Header: '#',
        accessor: 'closureIndex'
      },
      {
        Header: 'Time Opened',
        accessor: 'openingTime'
      },
      {
        Header: 'Time Closed',
        accessor: 'closingTime'
      },
      {
        Header: 'Store Credit',
        accessor: 'storeCredit'
      },
      {
        Header: 'Cash',
        accessor: 'totalCash'
      },
      {
        Header: 'Credit Card',
        accessor: 'creditCard'
      },
      {
        Header: 'Total',
        accessor: 'total'
      }
    ]}
    data={data}
    options={{
      showPagination: false,
      minRows: 1
    }}
  />
);

export default RegisterClosuresTable;
