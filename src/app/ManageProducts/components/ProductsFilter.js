import React from 'react';

import {
  RBSection,
  RBInput,
  RBSelect,
  RBButton,
  RBLink,
  RBLozenge
} from '../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import { logRender } from '../../../utils/debug';

const ProductsFilter = ({
  filter,
  types,
  brands,
  suppliers,
  tagName,
  setFilter,
  setTagName,
  removeTagFilter,
  resetFilter,
  applyFilter
}) => {
  logRender('render ProductsFilter');
  return (
    <RBSection type="tertiary" classes="vd-ptxl products-filter">
      <div className="vd-g-row">
        <div className="vd-g-col vd-g-s-12 vd-g-m-6">
          <RBField classes="vd-col-6 vd-mrm">
            <RBLabel>
              Search products by name, SKU, handle, or supplier code
            </RBLabel>
            <RBValue>
              <RBInput
                placeholder="Enter name, SKU, handle or supplier code"
                rbInputSymbol={{ align: 'left', icon: 'fa fa-search' }}
                value={filter.productName}
                onInputChange={productName => setFilter({ productName })}
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-col vd-g-s-12 vd-g-m-3">
          <RBField classes="vd-col-3">
            <RBLabel>Product type</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={filter.typeId}
                nullLabel="All"
                entities={types}
                entityKey="name"
                entityValue="id"
                onChange={type => setFilter({ typeId: type.id })}
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-col vd-g-s-12 vd-g-m-3" />
      </div>
      <div className="vd-g-row">
        <div className="vd-g-col vd-g-s-12 vd-g-m-3">
          <RBField classes="vd-mrm">
            <RBLabel>Brand</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={filter.brandId}
                nullLabel="All"
                entities={brands}
                entityKey="name"
                entityValue="id"
                onChange={brand => setFilter({ brandId: brand.id })}
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-col vd-g-s-12 vd-g-m-3">
          <RBField classes="vd-col-3 vd-mrm">
            <RBLabel>Supplier</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={filter.supplierId}
                nullLabel="All"
                entities={suppliers}
                entityKey="name"
                entityValue="id"
                onChange={supplier => setFilter({ supplierId: supplier.id })}
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-col vd-g-s-12 vd-g-m-3 vd-mbm">
          <RBField>
            <RBLabel>Tags</RBLabel>
            <RBValue>
              <RBInput
                placeholder="Enter tags"
                value={tagName}
                onInputChange={value => {
                  setTagName(value);
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setFilter({ tagName: e.target.value });
                    setTagName('');
                  }
                }}
              />
            </RBValue>
            <div className="vd-mts">
              {filter.tags.map(tag => (
                <RBLozenge
                  key={tag.id}
                  label={tag.name}
                  onDelete={e => {
                    e.preventDefault();
                    removeTagFilter(tag.id);
                  }}
                />
              ))}
            </div>
          </RBField>
        </div>
        <div className="text-right vd-g-col vd-g-s-12 vd-g-m-3">
          <RBField>
            <RBLabel />
            <RBValue classes="vd-mts">
              <RBLink
                classes="vd-plm vd-prl vd-ptm vd-pbm"
                onClick={() => {
                  resetFilter();
                  applyFilter();
                }}
              >
                Clear Filters
              </RBLink>
              <RBButton category="secondary" onClick={() => applyFilter()}>
                Apply Filter
              </RBButton>
            </RBValue>
          </RBField>
        </div>
      </div>
    </RBSection>
  );
};

export default ProductsFilter;
