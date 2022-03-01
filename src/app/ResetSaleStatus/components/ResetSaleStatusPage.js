import React from 'react';
import PrimaryLayout, {
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { Button } from '../../common/legacy/Basic';

const ResetSaleStatusPage = () => {
  return (
    <PrimaryLayout title="Status">
      <BodyComponent>
        <div className="vd-header vd-header--section">Reset local data</div>
        <p className="vd-p">
          We keep a copy of some of your store data in your web browser so you
          can keep selling if you lose your Internet connection. Sometimes, this
          gets out of sync. Resetting it can help if you're having trouble with
          Vend
        </p>
        <Button classes="vd-min" negative onClick={this.handleResetData}>
          Reset Data
        </Button>
      </BodyComponent>
    </PrimaryLayout>
  );
};

export default ResetSaleStatusPage;
