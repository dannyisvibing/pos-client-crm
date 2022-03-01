import React from 'react';
import VariantItemsTable from './VariantItemsTable';
import DescriptionSection from './DescriptionSection';
import SKUInputSection from './SKUInput';
import { Switch, Button } from '../../common/legacy/Basic';
import Selectize from '../../common/legacy/Selectize';
import ProductVariantInventoryTable from './VariantInventoryTable';
import TagInput from './TagInput';

const StandardInventory = ({
  primaryTrackingInventory,
  productInventory,
  primarySKU,
  skuGeneration,
  taxOptions,
  hasVariants,
  hasInventory,
  variantAttrNameOptions,
  onPrimaryTrackingChange,
  onToggleHasVariants,
  onToggleTrackingInventory,
  onPrimarySKUChange,
  onVariantAttrAdd,
  onVariantAttrNameChange,
  onVariantValueAdd,
  onVariantValueRemove,
  onVariantAttrRemove,
  onVariantItemRemove,
  onVariantItemChange,
  onVariantItemTrackingChange,
  onVariantItemTaxChange,
  onFormElementStateChange
}) => (
  <div>
    {/* Input component for primary SKU */}
    {!hasVariants &&
      skuGeneration === 'by-number' && (
        <SKUInputSection value={primarySKU} onChange={onPrimarySKUChange} />
      )}

    {/* User can enable / disable the option to enable the product to have variants */}
    <DescriptionSection
      classes="vd-pln vd-prn"
      title="Variant Products"
      description="These are products that have different versions, like size or color. Turn this on to specify up to three attributes (like color), and unlimited values for each attribute (like green, blue, black)."
    >
      <span>This product has variants</span>
      <div className="vd-value mtm">
        <Switch checked={hasVariants} onChange={onToggleHasVariants} />
      </div>
    </DescriptionSection>

    {/* User can enable / disable the option to enable the product to track inventory */}
    <div>
      <hr className="vd-hr" />
      <DescriptionSection
        classes="vd-pln vd-prn"
        title="Tracking Inventory"
        description="Leave this on if you want to keep track of your inventory quantities. You'll be able to report on cost of goods sold, product performance, and projected weeks cover, as well as manage your store using inventory orders, transfers and rolling inventory counts."
      >
        <span>Tracking inventory with Rombo</span>
        <div className="vd-value mtm">
          <Switch checked={hasInventory} onChange={onToggleTrackingInventory} />
        </div>
      </DescriptionSection>

      {/* If user enable tracking inventory and the product doesn't have any variants, tracking inventory table is shown */}
      {hasInventory &&
        !hasVariants && (
          <div>
            <hr className="vd-hr" />
            <ProductVariantInventoryTable
              inventoryTracking={primaryTrackingInventory}
              onChangeTrackingDetail={onPrimaryTrackingChange}
              onFormElementStateChange={onFormElementStateChange}
            />
          </div>
        )}
    </div>

    {hasVariants && (
      <div>
        <hr className="vd-hr" />
        {productInventory.variantAttrs.map((variant, i) => (
          <div className="vd-flex" key={i}>
            <Selectize
              label={i === 0 ? 'Attribute (e.g. Colour)' : undefined}
              short
              classes="vd-mbs"
              options={variantAttrNameOptions}
              value={variant.attrId}
              onChange={attr => onVariantAttrNameChange(i, attr)}
            />
            <TagInput
              label={i === 0 ? 'Value (e.g. Red, Blue, Green)' : undefined}
              tags={variant.values}
              onAddNewTag={value => onVariantValueAdd(i, value)}
              onRemoveTag={value => onVariantValueRemove(i, value)}
              classes={{ root: 'vd-mbs vd-mrm' }}
            />
            {i !== 0 && (
              <Button
                unnested
                negative
                table
                faIcon="fa fa-trash"
                onClick={e => onVariantAttrRemove(i)}
              />
            )}
          </div>
        ))}
        {productInventory.variantAttrs.length < 3 && (
          <a className="vd-mls vd-link" onClick={onVariantAttrAdd}>
            + Add Attribute
          </a>
        )}
        {productInventory.variantItems.length !== 0 && (
          <VariantItemsTable
            trackingEnabled={hasInventory}
            variantItems={productInventory.variantItems}
            taxOptions={taxOptions}
            onVariantItemRemove={onVariantItemRemove}
            onVariantItemChange={onVariantItemChange}
            onVariantItemTrackingChange={onVariantItemTrackingChange}
            onVariantItemTaxChange={onVariantItemTaxChange}
            onFormElementStateChange={state =>
              onFormElementStateChange('variantItemsTable', state)
            }
          />
        )}
      </div>
    )}
  </div>
);

export default StandardInventory;
