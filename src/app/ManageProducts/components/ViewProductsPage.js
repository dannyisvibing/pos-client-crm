import React, { Fragment } from 'react';
import {
  RBSection,
  RBSectionBack,
  RBHeader,
  RBFlex,
  RBFlag
} from '../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import DescriptionSection from '../../common/components/DescriptionSection';
import HistoryTable from '../legacy/HistoryTable';
import InventoryTable from '../legacy/InventoryTable';

const ViewProducts = props => {
  const {
    generalData,
    inventoryTableDatasource,
    historyTableDatasource
  } = props;
  return (
    <Fragment>
      <RBSection>
        <RBHeader category="page">
          <RBSectionBack href="/product" />
          {generalData.name}
        </RBHeader>
      </RBSection>
      <RBSection type="action-bar">
        <RBFlex flex flexJustify="between">
          <RBButtonGroup>
            <RBButton
              modifiers={['text']}
              href={`/product/edit/${generalData.primaryId}`}
              category="secondary"
            >
              Edit Product
            </RBButton>
            {inventoryTableDatasource.type === 'variants' && (
              <RBButton
                modifiers={['text']}
                href={`/product/add_variant/${generalData.primaryId}`}
                category="secondary"
              >
                Add Variant
              </RBButton>
            )}
          </RBButtonGroup>
          <RBButtonGroup>
            <RBButton
              modifiers={['ghost']}
              onClick={e => this.handleDelete(e, generalData.primaryId)}
            >
              Delete Product
            </RBButton>
          </RBButtonGroup>
        </RBFlex>
      </RBSection>
      <RBSection classes="vd-mtl">
        <DescriptionSection
          title="General"
          description="This is general information of this product"
        >
          <div>{generalData.description}</div>
          <div className="vd-mtm vd-mbm">
            {generalData.tags.map((tag, i) => (
              <RBFlag key={i} classes={i !== 0 ? 'vd-mls' : ''}>
                {tag}
              </RBFlag>
            ))}
          </div>
          <hr className="vd-hr" />
          <div className="vd-g-row">
            <RBField>
              <RBLabel>Brand</RBLabel>
              <RBValue>{generalData.brand}</RBValue>
            </RBField>
            <RBField>
              <RBLabel>Supply Price</RBLabel>
              <RBValue>{generalData.supplyPrice}</RBValue>
            </RBField>
          </div>
          <div className="vd-g-row">
            <RBField>
              <RBLabel>Handle</RBLabel>
              <RBValue>{generalData.handle}</RBValue>
            </RBField>
            <RBField>
              <RBLabel>Supplier</RBLabel>
              <RBValue>{generalData.supplier}</RBValue>
            </RBField>
          </div>
          <div className="vd-g-row">
            <RBField>
              <RBLabel>Average Cost</RBLabel>
              <RBValue>{generalData.averageCost}</RBValue>
            </RBField>
          </div>
        </DescriptionSection>
        <hr className="vd-hr vd-mtm vd-mbm" />
        <DescriptionSection
          title="Inventory"
          description="This is inventory information of this product"
        >
          <InventoryTable
            inventoryInfo={inventoryTableDatasource}
            onDelete={() => {}}
          />
        </DescriptionSection>
        <hr className="vd-hr vd-mtm vd-mbm" />
        <HistoryTable data={historyTableDatasource} />
      </RBSection>
    </Fragment>
  );
};

export default ViewProducts;
