import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { RBSection, RBInput } from '../../../../rombostrap';
import DescriptionSection from '../../../common/components/DescriptionSection';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import { getOutletById } from '../../../../modules/outlet';

import SimpleDatePicker from '../../../common/components/SimpleDatePicker';

const PurchaseOrderDetailUpdate = ({
  id,
  name,
  reference,
  supplier,
  outletId,
  dueAt,
  supplierInvoice,
  onFormChange,
  getOutletById
}) => (
  <form className="vd-mbxl">
    <RBSection classes="vd-mtl">
      <DescriptionSection
        title="General"
        description="Change general information for this order"
      >
        <div className="vd-g-row">
          <RBField>
            <RBLabel>Order name</RBLabel>
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
        <div className="vd-g-row vd-mbl">
          <RBField>
            <RBLabel>Supplier</RBLabel>
            <RBValue classes="vd-mts">{supplier.name}</RBValue>
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
            <RBValue classes="vd-mts">
              {getOutletById(outletId).outletName}
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
      </DescriptionSection>
    </RBSection>
  </form>
);

const mapStateToProps = state => ({
  getOutletById(id) {
    return getOutletById(state, id);
  }
});

const enhance = compose(connect(mapStateToProps));

export default enhance(PurchaseOrderDetailUpdate);
