import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';
import Meter from './Meter';
import Metric from './Metric';
import ReportMetric from './ReportMetric';
import { RBLink } from '../../../../rombostrap';
import { hasPermission } from '../../../../modules/user';

const UserPerformanceMetrics = ({
  classes,
  data = {},
  formatCurrency,
  hasPermission
}) => (
  <div className={classes}>
    <div>
      <h2 className="vd-text-sub-heading vd-mbl ds-align-header">
        Your Sales Targets
      </h2>
      <Meter value={data.targetProgressPercent} />
      <div className="ds-user-perf-targets">
        <Metric value={formatCurrency(data.totalRevenue)} />
        {!!data.targetRevenue && (
          <span className="vd-text-sub-heading vd-no-wrap">
            {formatCurrency(data.targetRevenue)}
          </span>
        )}
        {!data.targetRevenue && (
          <span className="vd-text-body pro-no-sales-target">
            {hasPermission('user.add_edit') ? (
              <RBLink href="/setup/users" isNavLink={false} secondary>
                Set a Sales Target
              </RBLink>
            ) : (
              <span>No Target Set</span>
            )}
          </span>
        )}
      </div>
    </div>
    <div className="vd-g-row vd-g-row--gutter-l vd-g-s-up-2">
      <ReportMetric
        label="Average Sale Value"
        metric="basketValue"
        average={true}
        format="currency"
        data={data.reportData}
        classes="vd-g-col"
      />
      <ReportMetric
        label="Average Items Per Sale"
        metric="basketSize"
        average={true}
        data={data.reportData}
        classes="vd-g-col"
      />
    </div>
  </div>
);

const enhance = compose(
  connect(state => ({
    hasPermission(permission) {
      return hasPermission(state, permission);
    }
  })),
  withCurrencyFormatter
);

export default enhance(UserPerformanceMetrics);
