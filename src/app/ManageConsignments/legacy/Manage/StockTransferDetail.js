import React from 'react';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DescriptionSection from '../../../common/components/DescriptionSection';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import { RBFlex, RBButton } from '../../../../rombostrap';

import { getOutletById } from '../../../../modules/outlet';

const StockTransferDetail = ({
  id,
  name,
  dueAt,
  sourceOutletId,
  outletId,
  getOutletById
}) => (
  <DescriptionSection
    title="General"
    description="This is the general information of this order"
  >
    <div className="vd-g-row">
      <RBField>
        <RBLabel>Order name</RBLabel>
        <RBValue>{name}</RBValue>
      </RBField>
      <RBField classes="vd-mll">
        <RBLabel>Deliver due</RBLabel>
        <RBValue>{moment(dueAt).format('D MMM YYYY')}</RBValue>
      </RBField>
    </div>
    <div className="vd-g-row">
      <RBField>
        <RBLabel>Order from</RBLabel>
        <RBValue>{getOutletById(sourceOutletId).outletName}</RBValue>
      </RBField>
      <RBField classes="vd-mll" />
    </div>
    <div className="vd-g-row">
      <RBField>
        <RBLabel>Deliver to</RBLabel>
        <RBValue>{getOutletById(outletId).outletName}</RBValue>
      </RBField>
      <RBField classes="vd-mll" />
    </div>
    <div className="vd-g-row">
      <RBFlex flex flexJustify="between" flexAlign="center">
        <div />
        <RBButton
          href={`/product/consignment/${id}/editDetails`}
          category="secondary"
          modifiers={['text']}
        >
          Edit Order Details
        </RBButton>
      </RBFlex>
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
