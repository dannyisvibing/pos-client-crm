import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from '../../common/containers/MainLayoutContainer';
import WebRegisterLayout from '../../common/components/WebRegisterLayout';
import OpenRegisterClosure from '../../OpenRegisterClosure';
import SaleHistory from '../../SaleHistory';
import ManageCashManagement from '../../ManageCashManagement';
import ResetSaleStatus from '../../ResetSaleStatus';
import ManageQuickKey from '../../ManageQuickKey';
import SaleSettings from '../../SaleSettings';
import Sale from '../../Sale';
import SaleChangeConfirmationDialog from '../../common/containers/SaleChangeConfirmationDialogContainer';
import MustReturnToSaleDialog from '../../common/containers/MustReturnToSaleDialogContainer';
import SelectRegisterDialog from '../../common/containers/SelectRegisterDialogContainer';
import OfflineNotificationDialog from '../../common/containers/OfflineNotificationDialogContainer';
import { logRender } from '../../../utils/debug';

const RoutesConfig = () => {
  logRender('render WebRegister Routes');
  return (
    <MainLayout>
      <WebRegisterLayout>
        <Switch>
          <Route
            path="/webregister/registerclosure"
            component={OpenRegisterClosure}
          />
          <Route path="/webregister/history" component={SaleHistory} />
          <Route
            path="/webregister/cash-management"
            component={ManageCashManagement}
          />
          <Route path="/webregister/status" component={ResetSaleStatus} />
          <Route
            path="/webregister/settings/quickkeys/:layoutId"
            component={ManageQuickKey}
          />
          <Route path="/webregister/settings" component={SaleSettings} />
          <Route path="/webregister" component={Sale} />
          <Redirect path="/webregister/*" to="/webregister" />
        </Switch>
        <SaleChangeConfirmationDialog />
        <MustReturnToSaleDialog />
        <SelectRegisterDialog />
        <OfflineNotificationDialog />
      </WebRegisterLayout>
    </MainLayout>
  );
};

export default RoutesConfig;
