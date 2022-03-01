import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '../common/components/LoadingThrobber';

const LoadableWebRegisterRoute = Loadable({
  loader: () => import('../WebRegisterRoute'),
  loading: LoadingThrobber
});

export default () => <LoadableWebRegisterRoute />;
