import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from '../../common/containers/MainLayoutContainer';
import CustomerLayout from '../../common/containers/CustomerLayoutContainer';
import ManageCustomers from '../../ManageCustomers';
import ManageCustomerGroups from '../../ManageCustomerGroups';
import { logRender } from '../../../utils/debug';
import AddCustomerGroupDialog from '../../common/containers/AddCustomerGroupDialogContainer';
import OfflineNotificationDialog from '../../common/containers/OfflineNotificationDialogContainer';

const CustomerRoute = () => {
  logRender('render CustomerRoute');
  return (
    <MainLayout>
      <CustomerLayout>
        <Switch>
          <Route path="/customer/group" component={ManageCustomerGroups} />
          <Route path="/customer/:action?/:id?" component={ManageCustomers} />
          <Redirect path="/customer/*" to="/customer" />
        </Switch>
      </CustomerLayout>
      <AddCustomerGroupDialog />
      <OfflineNotificationDialog />
    </MainLayout>
  );
};

export default CustomerRoute;
