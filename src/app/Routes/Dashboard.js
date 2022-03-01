import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '../common/components/LoadingThrobber';

const LoadableDashboard = Loadable({
  loader: () => import('../Dashboard'),
  loading: LoadingThrobber
});

export default () => <LoadableDashboard />;
