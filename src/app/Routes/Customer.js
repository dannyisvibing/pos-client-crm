import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '../common/components/LoadingThrobber';

const LoadableCustomerRoute = Loadable({
  loader: () => import('../CustomerRoute'),
  loading: LoadingThrobber
});

export default () => <LoadableCustomerRoute />;
