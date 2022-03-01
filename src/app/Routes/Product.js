import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '../common/components/LoadingThrobber';

const LoadableProductsRoute = Loadable({
  loader: () => import('../ProductsRoute'),
  loading: LoadingThrobber
});

export default () => <LoadableProductsRoute />;
