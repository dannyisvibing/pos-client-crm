import React, { Component } from 'react';
import PrimaryContentLayout, {
  HeaderComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import GiftReportFilter from './GiftReportFilter';
import GiftCardsReportTableSummary from './GiftCardsReportTableSummary';

// To Do - Gift Card Report
class GiftCardReports extends Component {
  state = {};
  render() {
    return (
      <PrimaryContentLayout title="Gift Card Report">
        <HeaderComponent>
          <GiftReportFilter />
        </HeaderComponent>
        <BodyComponent>
          <GiftCardsReportTableSummary />
        </BodyComponent>
      </PrimaryContentLayout>
    );
  }
}

export default GiftCardReports;
