import React from 'react';
import moment from 'moment';
import BaseTable from '../../common/components/BaseTable';
import { RBLink } from '../../../rombostrap';

const GroupList = ({ customerGroups }) => (
  <BaseTable
    columns={[
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Date created',
        Cell: row => (
          <span>{moment(row.original.createdAt).format('D MMM YYYY')}</span>
        )
      },
      {
        Header: '',
        Cell: row => (
          <RBLink
            secondary
            href={`/customer?customerGroupId=${row.original.id}`}
          >
            View Customers
          </RBLink>
        )
      }
    ]}
    data={customerGroups}
    options={{
      showPagination: false,
      minRows: 1
    }}
  />
);

export default GroupList;
