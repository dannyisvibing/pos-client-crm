import React from 'react';
import PrimaryLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import CashManagementTable from './CashManagementTable';
import { RBButton } from '../../../rombostrap';
import AddRemoveCashDialog from './AddRemoveCash';

const ManageCashManagementPage = props => {
  const { datasource, dialogState, onToggleDialog, onSubmit } = props;
  return (
    <PrimaryLayout title="Cash Management">
      <TipComponent>
        <div className="vd-flex vd-flex--justify-between vd-flex--align-center">
          <span>Record your cash movements for the day.</span>
          <div className="vd-button-group">
            <RBButton category="negative" onClick={() => onToggleDialog(false)}>
              Remove Cash
            </RBButton>
            <RBButton category="primary" onClick={() => onToggleDialog(true)}>
              Add Cash
            </RBButton>
          </div>
        </div>
      </TipComponent>
      <BodyComponent>
        <CashManagementTable data={datasource} />
        <AddRemoveCashDialog
          open={dialogState.isOpen}
          isAdding={dialogState.isAdding}
          onRequestClose={() => onToggleDialog()}
          onSubmit={onSubmit}
        />
      </BodyComponent>
    </PrimaryLayout>
  );
};

export default ManageCashManagementPage;
