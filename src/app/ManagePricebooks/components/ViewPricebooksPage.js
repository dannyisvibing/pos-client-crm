import React from 'react';
import moment from 'moment';
import {
  RBLoader,
  RBSection,
  RBSectionBack,
  RBHeader,
  RBFlex
} from '../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import DescriptionSection from '../../common/components/DescriptionSection';
import PricebookItemsPresentTable from '../containers/PricebookItemsPresentTableContainer';
import { logRender } from '../../../utils/debug';

const ViewPricebooksPage = props => {
  logRender('render ViewPricebooksPage');
  const { pricebook } = props;
  return false ? ( // STATES.inProgress
    <div className="up-page-loading">
      <RBLoader />
    </div>
  ) : true ? ( // STATES.ready
    <div>
      <RBSection>
        <RBHeader category="page">
          <RBSectionBack href="/product/price_book" />
          {pricebook.name}
        </RBHeader>
      </RBSection>
      <RBSection type="action-bar">
        <RBFlex flex flexJustify="between">
          <RBButtonGroup>
            <RBButton
              modifiers={['text']}
              href={`/product/price_book/edit/${pricebook.bookId}`}
              category="secondary"
            >
              Edit Price Book
            </RBButton>
            <RBButton modifiers={['text']} category="secondary">
              Export Price Book
            </RBButton>
            <RBButton
              modifiers={['text']}
              category="secondary"
              onClick={props.onDuplicatePricebook}
            >
              Duplicate Price Book
            </RBButton>
          </RBButtonGroup>
          <RBButtonGroup>
            <RBButton modifiers={['ghost']} onClick={props.onDeletePricebook}>
              Delete Price Book
            </RBButton>
          </RBButtonGroup>
        </RBFlex>
      </RBSection>
      <RBSection classes="vd-mtl">
        <DescriptionSection
          title="General"
          description="This is general information for this price book"
        >
          <div className="vd-g-row">
            <RBField>
              <RBLabel>Customer Group</RBLabel>
              <RBValue>{pricebook.customerGroup.name}</RBValue>
            </RBField>
            <RBField classes="vd-mll">
              <RBLabel>Valid From</RBLabel>
              <RBValue>
                {moment(pricebook.validFrom).format('DD MMM YYYY')}
              </RBValue>
            </RBField>
          </div>
          <div className="vd-g-row">
            <RBField>
              <RBLabel>Outlet</RBLabel>
              <RBValue>{pricebook.outlet.outletName}</RBValue>
            </RBField>
            <RBField classes="vd-mll">
              <RBLabel>Valid To</RBLabel>
              <RBValue>
                {moment(pricebook.validTo).format('DD MMM YYYY')}
              </RBValue>
            </RBField>
          </div>
        </DescriptionSection>
        <RBSection>
          <PricebookItemsPresentTable pricebookItems={pricebook.items} />
        </RBSection>
      </RBSection>
    </div>
  ) : (
    <div>{/* To Do - Error handling */}</div>
  );
};

export default ViewPricebooksPage;
