import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '../common/components/LoadingThrobber';

const LoadableSetupRoute = Loadable({
  loader: () => import('../SetupRoute'),
  loading: LoadingThrobber
});

export default () => <LoadableSetupRoute />;
