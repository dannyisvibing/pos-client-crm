import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../styles/BaseTable.css';

const BaseTable = ({ data, columns, options }) => (
  <div>
    <ReactTable
      data={data}
      columns={columns}
      className="-highlight"
      {...options}
    />
  </div>
);

BaseTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  options: PropTypes.object
};

BaseTable.defaultProps = {
  data: [],
  columns: []
};

export default BaseTable;
