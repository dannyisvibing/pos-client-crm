import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import CoreLayout from '../common/containers/CoreLayoutContainer';
import PublicRoute from '../common/containers/PublicRouteContainer';
import ProtectedRoute from '../common/containers/ProtectedRouteContainer';
import LoginPage from './Login';
import Dashboard from './Dashboard';
import WebRegister from './WebRegister';
import Reporting from './Reporting';
import Product from './Product';
import Customer from './Customer';
import Setup from './Setup';
import NotFoundPage from '../NotFoundPage';
import { logRender } from '../../utils/debug';

const RoutesConfig = () => {
  logRender('render Routes');
  return (
    <CoreLayout>
      <Switch>
        <Redirect exact from="/" to="/dashboard" />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/webregister" component={WebRegister} />
        <ProtectedRoute path="/reporting" component={Reporting} />
        <ProtectedRoute path="/product" component={Product} />
        <ProtectedRoute path="/customer" component={Customer} />
        <ProtectedRoute path="/setup" component={Setup} />
        <PublicRoute path="/login" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </CoreLayout>
  );
};

export default RoutesConfig;
