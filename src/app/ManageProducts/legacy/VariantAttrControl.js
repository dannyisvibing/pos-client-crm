import React from 'react';
import { Switch, Input, Button } from '../../common/legacy/Basic';
import Selectize from '../../common/legacy/Selectize';

const ProductVariantAttrControl = ({
  hasVariant,
  variantAttrs,
  variantAttrNameOptions,
  onToggleHasVariants,
  onVariantAttrNameChange,
  onVariantValueChange,
  onVariantAttrRemove
}) => (
  <div>
    <div className="vd-mbl">
      <span className="vd-mrl">This product has variants</span>
      <Switch checked={hasVariant || false} onChange={onToggleHasVariants} />
    </div>
    {hasVariant && <hr className="vd-hr" />}
    {variantAttrs.map((variant, i) => (
      <div className="vd-flex" key={i}>
        <Selectize
          label={i === 0 ? 'Attribute (e.g. Colour)' : undefined}
          short
          classes="vd-mbs"
          options={variantAttrNameOptions}
          value={variant.attrId}
          onChange={attr => onVariantAttrNameChange(i, attr)}
        />
        <Input
          label={i === 0 ? 'Value (e.g. Red, Blue, Green)' : undefined}
          value={variant.value}
          onChange={e => onVariantValueChange(i, e.target.value)}
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
  </div>
);

export default ProductVariantAttrControl;
