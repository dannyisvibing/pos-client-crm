import React, { Component } from 'react';
import BasicTableSummaryItem from './BasicReportTableSummaryItem';

class GiftCardsReportTableSummary extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="vd-flex">
          <div className="vd-col-6 vd-prl">
            <BasicTableSummaryItem label="Total Value Sold" value="$0.00" />
          </div>
          <div className="vd-col-6 vd-pll">
            <BasicTableSummaryItem label="Total Value Redeemed" value="$0.00" />
          </div>
        </div>
        <div className="vd-flex">
          <div className="vd-col-6 vd-prl">
            <BasicTableSummaryItem label="Outstanding Balance" value="$0.00" />
          </div>
          <div className="vd-col-6 vd-pll">
            <BasicTableSummaryItem
              label="Gift Cards in Circulation"
              value="0"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GiftCardsReportTableSummary;
