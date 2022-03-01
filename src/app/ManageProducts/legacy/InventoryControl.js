import React from 'react';
import SKUInputSection from './SKUInput';
import DescriptionSection from './DescriptionSection';
import { Switch } from '../../common/legacy/Basic';
import ProductVariantInventoryTable from './VariantInventoryTable';

const InventoryControl = ({
  primarySKU,
  hasInventory,
  primaryTrackingInventory,
  onPrimarySKUChange,
  onToggleTrackingInventory,
  onPrimaryTrackingChange,
  onFormElementStateChange
}) => (
  <div>
    <SKUInputSection value={primarySKU} onChange={onPrimarySKUChange} />
    <div>
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

      {hasInventory && (
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
  </div>
);

export default InventoryControl;
