import React from 'react';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import RBInput, {
  RBInputErrorMessageSection
} from '../../../../rombostrap/components/RBInput';
import { RBSection, RBSelect } from '../../../../rombostrap';
import DescriptionSection from '../../../common/components/DescriptionSection';
import SimpleDatePicker from '../../../common/components/SimpleDatePicker';

const NewStockReturnDetail = ({
  name,
  dueAt,
  supplierId,
  suppliers = [],
  reference,
  outletId,
  outlets = [],
  supplierInvoice,
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
            <RBLabel>Deliver to</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={supplierId}
                nullLabel="Any"
                entities={suppliers}
                entityValue="id"
                onChange={supplier => onFormChange('supplierId', supplier.id)}
              />
              {formInvalidCode === 1 && (
                <RBInputErrorMessageSection>
                  You must provide outlet to return to
                </RBInputErrorMessageSection>
              )}
            </RBValue>
          </RBField>
          <RBField classes="vd-mll">
            <RBLabel>Return No.</RBLabel>
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
            <RBLabel>Return from</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={outletId}
                nullLabel=""
                entities={outlets}
                entityKey="outletName"
                entityValue="outletId"
                onChange={outlet => onFormChange('outletId', outlet.outletId)}
              />
            </RBValue>
          </RBField>
          <RBField classes="vd-mll">
            <RBLabel>Supplier invoice</RBLabel>
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
      </DescriptionSection>
    </RBSection>
  </form>
);

export default NewStockReturnDetail;
