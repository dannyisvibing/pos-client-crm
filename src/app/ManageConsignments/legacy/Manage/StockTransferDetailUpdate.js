import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DescriptionSection from '../../../common/components/DescriptionSection';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import { RBSection, RBInput } from '../../../../rombostrap';
import SimpleDatePicker from '../../../common/components/SimpleDatePicker';
import { getOutletById } from '../../../../modules/outlet';

const NewStockTransferDetailUpdate = ({
  name,
  sourceOutletId,
  dueAt,
  outletId,
  autoFill = 'yes',
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
            <RBLabel>Order name</RBLabel>
            <RBValue>
              <RBInput
                value={name}
                onInputChange={name => onFormChange('name', name)}
              />
            </RBValue>
          </RBField>
          <RBField classes="vd-mll">
            <RBLabel>Source outlet</RBLabel>
            <RBValue classes="vd-mts">
              {getOutletById(sourceOutletId).outletName}
            </RBValue>
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
            <RBValue classes="vd-mts">
              {getOutletById(outletId).outletName}
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

export default enhance(NewStockTransferDetailUpdate);
