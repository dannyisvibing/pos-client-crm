import React from 'react';
import Loadable from 'react-loadable';
import LoadingThrobber from '../common/components/LoadingThrobber';

const LoadableReportingRoute = Loadable({
  loader: () => import('../ReportingRoute'),
  loading: LoadingThrobber
});

export default () => <LoadableReportingRoute />;
