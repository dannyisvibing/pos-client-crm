import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import MainLayout from '../../common/containers/MainLayoutContainer';
import ReportingLayout from '../../common/components/ReportingLayout';
import ReportingRegisterClosures from '../../ReportingRegisterClosures';
import ReportingGiftCards from '../../ReportingGiftCards';
import ReportingStoreCredit from '../../ReportingStoreCredit';
import ReportingDetailsShow from '../../ReportingDetailsShow';
import ReportingDashboard from '../../ReportingDashboard';
import OfflineNotificationDialog from '../../common/containers/OfflineNotificationDialogContainer';
import { logRender } from '../../../utils/debug';

const RoutesConfig = () => {
  logRender('render Reporting Routes');
  return (
    <MainLayout>
      <ReportingLayout>
        <Switch>
          <Route
            path="/reporting/closures"
            component={ReportingRegisterClosures}
          />
          <Route path="/reporting/gift_cards" component={ReportingGiftCards} />
          <Route
            path="/reporting/store_credit"
            component={ReportingStoreCredit}
          />
          <Route path="/reporting/:slug" component={ReportingDetailsShow} />
          <Route path="/reporting" component={ReportingDashboard} />
          <Redirect path="/reporting/*" to="/reporting" />
        </Switch>
      </ReportingLayout>
      <OfflineNotificationDialog />
    </MainLayout>
  );
};

export default RoutesConfig;
