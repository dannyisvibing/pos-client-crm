import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from '../../common/components/BaseTable';
import { RBButton, RBLink } from '../../../rombostrap';
import ModalTypes from '../../../constants/modalTypes';
import { logRender } from '../../../utils/debug';

const ProductTagsTable = ({ datasource, openModal }) => {
  logRender('render ProductTagsTable');
  return (
    <BaseTable
      columns={[
        {
          Header: 'Name',
          accessor: 'name'
        },
        {
          Header: 'Number of Products',
          accessor: 'count'
        },
        {
          Header: '',
          Cell: row => (
            <div>
              <RBLink
                href={`/product?tags=${row.original.id}`}
                secondary
                title="View Products"
              >
                View Products
              </RBLink>
              <RBButton
                category="primary"
                modifiers={['text', 'table', 'inline']}
                classes="vd-mls"
                style={{ minWidth: 'unset' }}
                onClick={e => {
                  e.preventDefault();
                  openModal({
                    type: ModalTypes.PRODUCT_TAGS,
                    id: row.original.id
                  });
                }}
              >
                <i className="fa fa-pencil" />
              </RBButton>
              <RBButton
                category="primary"
                modifiers={['text', 'table', 'inline']}
                classes="vd-mls"
                style={{ minWidth: 'unset' }}
                onClick={e => {
                  e.preventDefault();
                  // row.original.id
                }}
              >
                <i className="fa fa-trash" />
              </RBButton>
            </div>
          )
        }
      ]}
      data={datasource}
      options={{
        showPagination: false,
        minRows: 1
      }}
    />
  );
};

const { array } = PropTypes;
ProductTagsTable.propTypes = {
  datasource: array
};

export default ProductTagsTable;
