import React from 'react';
import { RBTabs, RBTab, RBButton, RBLink, RBSwitch } from '../../../rombostrap';
import BaseTable from '../../common/components/BaseTable';
import '../styles/ProductTable.css';
import { logRender } from '../../../utils/debug';

const ProductTable = ({
  filter,
  datasource,
  setFilter,
  applyFilter,
  setActive
}) => {
  logRender('render ProductTable');
  return (
    <div>
      <RBTabs
        activeValue={filter.status}
        onClick={(e, status) => {
          setFilter({ status });
          applyFilter();
        }}
        tabs={['Active', 'Inactive', 'All']}
      >
        <RBTab value="active">Active</RBTab>
        <RBTab value="inactive">Inactive</RBTab>
        <RBTab value="all">All</RBTab>
        {/* To Do - Export Product Lists */}
        <RBButton
          modifiers={['text']}
          category="secondary"
          classes="right"
          onClick={e => {
            e.preventDefault();
          }}
        >
          <i className="fa fa-download vd-mrs" />Export List
        </RBButton>
      </RBTabs>
      <BaseTable
        data={datasource}
        columns={[
          {
            Header: 'Product',
            width: 250,
            Cell: row => (
              <div>
                <RBLink href={`/product/show/${row.original.id}`} secondary>
                  {row.original.title}
                </RBLink>
                <div className="vd-text--sub">{row.original.sku}</div>
              </div>
            )
          },
          {
            Header: 'Created',
            accessor: 'created'
          },
          {
            Header: 'Tags',
            accessor: 'tags',
            Cell: row => {
              if (row.original.tags) {
                return row.original.tags.map((tagName, i) => (
                  <RBLink
                    key={i}
                    onClick={e => {
                      e.preventDefault();
                      setFilter({ tagName, options: { merge: false } });
                      applyFilter();
                    }}
                    secondary
                  >
                    {tagName}
                  </RBLink>
                ));
              } else {
                return null;
              }
            }
          },
          {
            Header: 'Brand',
            accessor: 'brand',
            Cell: row => (
              <RBLink
                onClick={e => {
                  e.preventDefault();
                  setFilter({
                    brandId: row.original.brandId,
                    options: { merge: false }
                  });
                  applyFilter();
                }}
                secondary
              >
                {row.original.brand}
              </RBLink>
            )
          },
          {
            Header: 'Supplier',
            accessor: 'supplier',
            Cell: row => (
              <RBLink
                onClick={e => {
                  e.preventDefault();
                  setFilter({
                    supplierId: row.original.supplierId,
                    options: { merge: false }
                  });
                  applyFilter();
                }}
                secondary
              >
                {row.original.supplier}
              </RBLink>
            )
          },
          {
            Header: 'Variants',
            id: 'variants',
            width: 150,
            expander: true,
            Expander: ({ isExpanded, ...rest }) => {
              const variants = rest.original.variants;
              if (variants && variants.length > 0) {
                return (
                  <div className="product-variant-a">
                    <RBLink isNavLink={false} secondary>
                      {`${variants.length} variants`}
                    </RBLink>
                    {isExpanded ? (
                      <span>
                        <i className="fa fa-caret-up" />
                      </span>
                    ) : (
                      <span>
                        <i className="fa fa-caret-down" />
                      </span>
                    )}
                  </div>
                );
              } else {
                return '-';
              }
            }
          },
          {
            Header: 'Price',
            accessor: 'price'
          },
          {
            Header: 'Count',
            accessor: 'count'
          },
          {
            Header: '',
            accessor: 'actions',
            Cell: row => (
              <div className="product-actions">
                <RBButton
                  href={`/product/edit/${row.original.id}`}
                  category="primary"
                  modifiers={['icon', 'table']}
                >
                  <i className="fa fa-pencil" />
                </RBButton>
                <RBSwitch
                  modifiers={['small']}
                  checked={row.original.active}
                  onChange={e => setActive(row.original.id, e.target.checked)}
                />
              </div>
            )
          }
        ]}
        options={{
          SubComponent: row => {
            const variants = row.original.variants;
            if (variants && variants.length > 0) {
              return (
                <div className="product-variants">
                  {variants.map((variant, i) => (
                    <div key={i} className="product-variants-detail">
                      <div className="variant-item">
                        <RBLink
                          href={`/product/edit/${variant.id}`}
                          classes="vd-mll"
                          secondary
                        >
                          {variant.name}
                        </RBLink>
                      </div>
                      <div className="variant-price">{variant.price}</div>
                      <div className="variant-count">{variant.count}</div>
                    </div>
                  ))}
                </div>
              );
            } else {
              return null;
            }
          },
          showPagination: false,
          minRows: 1
        }}
      />
    </div>
  );
};

export default ProductTable;
