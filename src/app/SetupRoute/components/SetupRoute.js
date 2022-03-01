import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from '../../common/containers/MainLayoutContainer';
import SetupLayout from '../../common/containers/SetupLayoutContainer';
import GeneralSetup from '../../GeneralSetup';
import ManageOutletsAndRegisters from '../../ManageOutletsAndRegisters';
import ManageSalesTax from '../../ManageSalesTax';
import ManageUsers from '../../ManageUsers';
import ManageReceiptTemplate from '../../ManageReceiptTemplate';
import StoreCreditSetting from '../../StoreCreditSetting';
import LoyaltySetting from '../../LoyaltySetting';
import OfflineNotificationDialog from '../../common/containers/OfflineNotificationDialogContainer';
import { logRender } from '../../../utils/debug';

const RoutesConfig = () => {
  logRender('render Setup Routes');
  return (
    <MainLayout>
      <SetupLayout>
        <Switch>
          <Route
            path="/setup/outlets_and_registers"
            component={ManageOutletsAndRegisters}
          />
          <Route
            path="/setup/outlet/:action/:id?"
            render={renderProps => (
              <ManageOutletsAndRegisters {...renderProps} setupType="outlet" />
            )}
          />
          <Route
            path="/setup/register/:action/:id?"
            render={renderProps => (
              <ManageOutletsAndRegisters
                {...renderProps}
                setupType="register"
              />
            )}
          />
          />
          <Route
            path="/setup/receipt_template/:action/:id?"
            component={ManageReceiptTemplate}
          />
          <Route path="/setup/taxes" component={ManageSalesTax} />
          <Route path="/setup/loyalty" component={LoyaltySetting} />
          <Route path="/setup/users/:action?/:id?" component={ManageUsers} />
          <Route path="/setup/store_credit" component={StoreCreditSetting} />
          <Route path="/setup" component={GeneralSetup} />
          <Redirect path="/setup/*" to="/setup" />
        </Switch>
      </SetupLayout>
      <OfflineNotificationDialog />
    </MainLayout>
  );
};

export default RoutesConfig;
