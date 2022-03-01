import React from 'react';
import { RBSection, RBSelect } from '../../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import RBInput, {
  RBInputErrorMessageSection
} from '../../../../rombostrap/components/RBInput';
import DescriptionSection from '../../../common/components/DescriptionSection';

import SimpleDatePicker from '../../../common/components/SimpleDatePicker';

export const AutoFill = [
  {
    name: 'Auto-fill from reorder point',
    entity: 'yes'
  },
  {
    name: "Don't auto-fill",
    entity: 'no'
  }
];

const NewPurchaseOrderDetail = ({
  name,
  dueAt,
  supplierId,
  suppliers = [],
  reference,
  outletId,
  outlets = [],
  supplierInvoice,
  autoFill = 'yes',
  form = {},
  formInvalidCode,
  onFormChange
}) => (
  <form className="vd-mbxl">
    <RBSection classes="vd-mtl">
      <DescriptionSection
        title="General"
        description="Change general information for this order"
      >
        <div className="vd-g-row">
          <RBField>
            <RBLabel>Name / Reference</RBLabel>
            <RBValue>
              <RBInput
                value={name}
                onInputChange={name => onFormChange('name', name)}
              />
            </RBValue>
          </RBField>
          <RBField classes="vd-mll">
            <RBLabel>Delivery due</RBLabel>
            <RBValue>
              <SimpleDatePicker
                date={dueAt}
                onSelectDay={dueAt => onFormChange('dueAt', dueAt)}
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-row">
          <RBField>
            <RBLabel>Order From</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={supplierId}
                nullLabel="Any"
                entities={suppliers}
                entityValue="id"
                onChange={supplier => onFormChange('supplierId', supplier.id)}
              />
            </RBValue>
          </RBField>
          <RBField classes="vd-mll">
            <RBLabel>Order No.</RBLabel>
            <RBValue>
              <RBInput
                value={reference}
                onInputChange={reference =>
                  onFormChange('reference', reference)
                }
              />
            </RBValue>
          </RBField>
        </div>
        <div className="vd-g-row">
          <RBField>
            <RBLabel>Deliver to</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={outletId}
                nullLabel=""
                entities={outlets}
                entityKey="outletName"
                entityValue="outletId"
                onChange={outlet => onFormChange('outletId', outlet.outletId)}
              />
              {formInvalidCode === 1 && (
                <RBInputErrorMessageSection>
                  You must provide outlet to send to
                </RBInputErrorMessageSection>
              )}
            </RBValue>
          </RBField>
          <RBField classes="vd-mll">
            <RBLabel>Supplier Invoice</RBLabel>
            <RBValue>
              <RBInput
                value={supplierInvoice}
                onInputChange={supplierInvoice =>
                  onFormChange('supplierInvoice', supplierInvoice)
                }
              />
            </RBValue>
          </RBField>
        </div>
        <hr className="vd-hr vd-mtl vd-mbl" />
        <div className="vd-g-row">
          <RBField>
            <RBLabel>Auto Fill</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={autoFill}
                entities={AutoFill}
                onChange={autoFill => onFormChange('autoFill', autoFill.entity)}
              />
            </RBValue>
          </RBField>
          <RBField />
        </div>
      </DescriptionSection>
    </RBSection>
  </form>
);

export default NewPurchaseOrderDetail;
