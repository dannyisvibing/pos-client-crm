import React from 'react';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DescriptionSection from '../../../common/components/DescriptionSection';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';

import { getOutletById } from '../../../../modules/outlet';

const StockTransferDetail = ({
  sourceOutletId,
  outletId,
  createdAt,
  dueAt,
  getOutletById
}) => (
  <DescriptionSection
    classes="vd-mbxl"
    title="General"
    description="This is general information of this order"
  >
    <div className="vd-g-row">
      <div className="vd-g-col">
        <RBField>
          <RBLabel>Order from</RBLabel>
          <RBValue>{getOutletById(sourceOutletId).outletName}</RBValue>
        </RBField>
        <RBField>
          <RBLabel>Deliver to</RBLabel>
          <RBValue>{getOutletById(outletId).outletName}</RBValue>
        </RBField>
      </div>
      <div className="vd-g-col">
        <RBField>
          <RBLabel>Created</RBLabel>
          <RBValue>{moment(createdAt).format('D MMM YYYY')}</RBValue>
        </RBField>
        <RBField>
          <RBLabel>Created by</RBLabel>
          <RBValue>Michel Chang</RBValue>
        </RBField>
        <RBField>
          <RBLabel>Delivery due</RBLabel>
          <RBValue>{moment(dueAt).format('D MMM YYYY')}</RBValue>
        </RBField>
      </div>
    </div>
  </DescriptionSection>
);

const mapStateToProps = state => ({
  getOutletById(id) {
    return getOutletById(state, id);
  }
});

const enhance = compose(connect(mapStateToProps));

export default enhance(StockTransferDetail);
