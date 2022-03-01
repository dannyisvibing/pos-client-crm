import React, { Component } from 'react';
import { IconInput, Button } from '../../common/legacy/Basic';

class GiftReportFilter extends Component {
  state = {};
  render() {
    return (
      <form>
        <div className="vd-g-row">
          <div className="vd-g-col vd-g-s-6">
            <IconInput label="Gift card number" faIcon="fa fa-search" />
          </div>
          <div className="vd-g-col vd-g-s-6 vd-flex vd-flex--align-end vd-flex--justify-end">
            <Button primary>Apply Filter</Button>
          </div>
        </div>
      </form>
    );
  }
}

export default GiftReportFilter;
