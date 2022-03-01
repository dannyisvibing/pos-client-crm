import React from 'react';
import ReactTable from '../../common/components/BaseTable';
import { UserBadge } from '../../common/legacy/Basic';

const CashManagementTable = ({ data }) => (
  <ReactTable
    columns={[
      {
        Header: 'Time',
        accessor: 'time'
      },
      {
        Header: 'User',
        Cell: row => (
          <UserBadge
            user={`${row.original.userEmail} (${row.original.userName})`}
            description={row.original.userName}
          />
        )
      },
      {
        Header: 'Reasons',
        Cell: row => (
          <div>
            <div>{row.original.reason}</div>
            <div>{row.original.note}</div>
          </div>
        )
      },
      {
        Header: 'Transaction ($)',
        accessor: 'amount'
      }
    ]}
    data={data}
    options={{
      showPagination: false,
      minRows: 1
    }}
  />
);

export default CashManagementTable;
