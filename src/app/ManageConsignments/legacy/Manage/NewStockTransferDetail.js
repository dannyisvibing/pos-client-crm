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
import { AutoFill } from './NewPurchaseOrderDetail';

import SimpleDatePicker from '../../../common/components/SimpleDatePicker';

const NewStockTransferDetail = ({
  name,
  sourceOutletId,
  outlets,
  dueAt,
  outletId,
  autoFill = 'yes',
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
            <RBLabel>Source outlet</RBLabel>
            <RBValue>
              <RBSelect
                selectedEntity={sourceOutletId}
                nullLabel=""
                entities={outlets}
                entityKey="outletName"
                entityValue="outletId"
                onChange={outlet =>
                  onFormChange('sourceOutletId', outlet.outletId)
                }
              />
            </RBValue>
            {formInvalidCode === 1 && (
              <RBInputErrorMessageSection>
                You must provide outlet to transfer from
              </RBInputErrorMessageSection>
            )}
          </RBField>
        </div>
        <div className="vd-g-row">
          <RBField>
            <RBLabel>Delivery due</RBLabel>
            <RBValue>
              <SimpleDatePicker
                date={dueAt}
                onSelectDay={dueAt => onFormChange('dueAt', dueAt)}
              />
            </RBValue>
          </RBField>
          <RBField classes="vd-mll">
            <RBLabel>Destination outlet</RBLabel>
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
            {formInvalidCode === 2 && (
              <RBInputErrorMessageSection>
                You must provide outlet to transfer to
              </RBInputErrorMessageSection>
            )}
            {formInvalidCode === 3 && (
              <RBInputErrorMessageSection>
                Source and destination outlet must be different.
              </RBInputErrorMessageSection>
            )}
          </RBField>
        </div>
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

export default NewStockTransferDetail;
