import React from 'react';
import rbDashboardService from '../../managers/dashboard/dashboard.service';
import removeWidow from '../../../../utils/removeWidow';
import { RBSegControl, RBSelect } from '../../../../rombostrap';

const Topbar = ({
  periods,
  currentPeriod,
  currentOutlet,
  onChangeOutlet,
  onChangePeriod
}) => (
  <div className="ds-top-bar vd-g-row">
    <h1 className="ds-header vd-mrxl vd-g-col vd-g-l-5 vd-g-s-12">
      <span className="ds-header-wide">
        Hi{' '}
        {rbDashboardService.getUser().displayName ||
          rbDashboardService.getUser().username}, here's what's happening in{' '}
        {removeWidow(rbDashboardService.getStoreContextSubject())}.
      </span>
      <span className="ds-header-short">Here's what's happening.</span>
    </h1>
    <div className="ds-filters">
      <div className="ds-period-selector pro-runtime-period-selection vd-mrm">
        {/* To Do - check if dashboard is loading. If loading, disable */}
        {periods.map((period, i) => (
          <RBSegControl
            key={i}
            value={period.value}
            checked={period.value === currentPeriod}
            onChange={e => onChangePeriod(e.target.value)}
          >
            <span>{period.value}</span>
          </RBSegControl>
        ))}
      </div>
      {/* To Do - check if dashboard is loading. If loading, disable */}
      {rbDashboardService.getUserOutlets().length > 1 && (
        <div className="ds-outlet-selector pro-runtime-outlet-selection">
          <RBSelect
            entities={rbDashboardService.getUserOutlets()}
            selectedEntity={currentOutlet}
            entityKey="outletName"
            entityValue="outletId"
            nullLabel="All Outlets"
            onChange={onChangeOutlet}
          />
        </div>
      )}
    </div>
  </div>
);

export default Topbar;
