import React, { Component } from 'react';
import classnames from 'classnames';
import { RBButton } from '../../../rombostrap';
import DropDownMenu from './DropDown';
import ReportDateSelector from './ReportDateSelector';

const ButtonGroup = ({ classes, children }) => (
  <ul className={classnames('button-group', classes)}>
    <li>{children}</li>
  </ul>
);

class ReportControls extends Component {
  state = {};

  dateSelectorLabel(granularityDateSelection) {
    if (granularityDateSelection.periodType === 'single') return 'Date';
    return 'Date Range';
  }

  render() {
    const {
      reports,
      metrics,
      granularityDateSelection,
      canIncludeProducts,
      selectedReport,
      selectedMetric,
      includeProducts,
      showDatatableFilter,
      onUpdateDateSelection,
      onUpdateReport,
      onUpdateMetric,
      onUpdateIncludeProducts,
      onShowFilter,
      onExport
    } = this.props;
    return (
      <div>
        <div className="report-control-options">
          <ButtonGroup>
            <DropDownMenu
              label="Report Type"
              filter={{ key: 'type', value: selectedReport.type }}
              groupBy="menuGroup"
              items={reports}
              selectedItem={selectedReport}
              onSelect={onUpdateReport}
            />
          </ButtonGroup>
          {selectedReport.isAggregateSelectableReport() && (
            <ButtonGroup classes="vd-mls">
              <DropDownMenu
                label="Measure"
                items={metrics}
                selectedItem={selectedMetric}
                onSelect={onUpdateMetric}
              />
            </ButtonGroup>
          )}
          {selectedReport.hasDateFilter() && (
            <ButtonGroup classes="vd-mls">
              <ReportDateSelector
                label={this.dateSelectorLabel(granularityDateSelection)}
                granularityDateSelection={granularityDateSelection}
                config={selectedReport.config.datePicker}
                onUpdate={onUpdateDateSelection}
              />
            </ButtonGroup>
          )}
          {canIncludeProducts && (
            <ButtonGroup>
              <div className="basic-checkbox report-show-products">
                <input
                  id="include-products"
                  type="checkbox"
                  checked={includeProducts}
                  onChange={e => onUpdateIncludeProducts(e.target.checked)}
                />
                <label htmlFor="include-products">Show Products</label>
              </div>
            </ButtonGroup>
          )}
        </div>
        <div className="report-control-actions">
          <RBButton category="primary" onClick={onShowFilter}>
            {!showDatatableFilter ? 'Filter' : 'Remove Filter'}
            <span>
              <i className="fa fa-filter vd-mls" />
            </span>
          </RBButton>
          <RBButton category="primary" onClick={onExport}>
            Export Data
          </RBButton>
        </div>
      </div>
    );
  }
}

export default ReportControls;
