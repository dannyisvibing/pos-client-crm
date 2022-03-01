import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import GranularityDateSelection from '../../../modules/reporting/factories/granularity-date-selection';
import granularityDateRangeFilter from '../../../modules/reporting/utils/granularityDateRange';
import {
  DateSelectorTabs,
  DateSelectorTab,
  DateSelectorTabButton,
  DateSelector,
  DateSelectorFooter,
  DateSelectorFooterSection,
  DateSelectorPreview
} from './ReportDateSelector+Layout';
import { RBButton } from '../../../rombostrap';
import ReportDatePicker from './ReportDatePicker';
import ReportDateRangePicker from './ReportDateRangePicker';
import ReportGranularitySelector from './ReportGranularitySelector';

class ReportDateSelector extends Component {
  state = {
    open: false,
    selectedTab: '',
    isSelectionTooLarge: false,
    maxReportMonths: 0,
    tempDateSelection: null
  };

  componentWillMount() {
    this.setState({
      maxReportMonths: Math.round(window.maxReportDurationDays / 30)
    });
    const { granularityDateSelection } = this.props;
    var granularityKey =
      granularityDateSelection &&
      granularityDateSelection.granularity &&
      granularityDateSelection.granularity.key;
    this.granularityKeyChange(granularityKey);
  }

  componentWillReceiveProps(nextProps) {
    const {
      granularityDateSelection: prevGranularityDateSelection
    } = this.props;
    const {
      granularityDateSelection: nextGranularityDateSelection
    } = nextProps;
    var prevKey =
      prevGranularityDateSelection &&
      prevGranularityDateSelection.granularity &&
      prevGranularityDateSelection.granularity.key;
    var nextKey =
      nextGranularityDateSelection &&
      nextGranularityDateSelection.granularity &&
      nextGranularityDateSelection.granularity.key;
    if (prevKey !== nextKey) {
      this.granularityKeyChange(nextKey);
    }
  }

  dateRange(granularityDateSelection) {
    var dateFormat;
    if (granularityDateSelection.periodType === 'all') {
      return 'All Time';
    }
    dateFormat = 'Do MMM YYYY';
    if (granularityDateSelection.granularity.key === 'hour') {
      dateFormat += ' h:mm a';
    }
    return granularityDateRangeFilter(
      granularityDateSelection.getPeriodStartDate(),
      granularityDateSelection.getPeriodEndDate(),
      dateFormat
    );
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  changeTab(e, tab) {
    if (e) {
      e.preventDefault();
    }
    var tempDateSelection;
    if (tab === this.state.selectedTab) {
      return;
    }
    if (!this.state.tempDateSelection) {
      tempDateSelection = _.cloneDeep(this.props.granularityDateSelection);
    } else if (tab === 'all') {
      tempDateSelection = GranularityDateSelection.getAllSelection();
    } else if (tab === 'compare') {
      tempDateSelection = GranularityDateSelection.getCompareSelection();
    } else if (tab === 'single') {
      tempDateSelection = GranularityDateSelection.getSingleSelection();
    } else if (tab === 'range') {
      tempDateSelection = GranularityDateSelection.getRangeSelection();
    }

    this.setState({
      selectedTab: tab,
      tempDateSelection
    });
  }

  granularityKeyChange(newGranularity) {
    if (
      newGranularity === 'all' ||
      newGranularity === 'range' ||
      newGranularity === 'single'
    ) {
      this.changeTab(null, newGranularity);
    } else {
      this.changeTab(null, 'compare');
    }
  }

  selectToday = e => {
    e.preventDefault();
    var { tempDateSelection } = this.state;
    tempDateSelection.startDate = moment().toDate();
    this.setState({ tempDateSelection });
  };

  handleDateSelectionUpdate = update => {
    var { tempDateSelection } = this.state;
    tempDateSelection.update(update);
    this.setState({ tempDateSelection }, () => {
      this.checkDateLength();
    });
  };

  confirmDateSelection = e => {
    const { isSelectionTooLarge, tempDateSelection } = this.state;
    const { onUpdate } = this.props;
    e.preventDefault();
    if (isSelectionTooLarge) {
      return;
    }
    if (true) {
      // To Do - evaluate form validation
      this.setState({ open: false });
      onUpdate && onUpdate(tempDateSelection);
    }
  };

  checkDateLength() {
    var _ref, _ref1;
    var { isSelectionTooLarge, tempDateSelection } = this.state;
    if (window.maxReportDurationDays != null) {
      isSelectionTooLarge =
        window.maxReportDurationDays <
        ((_ref = tempDateSelection) != null
          ? (_ref1 = _ref.period) != null
            ? _ref1.lengthInDays()
            : void 0
          : void 0);
    }
    this.setState({ isSelectionTooLarge });
  }

  render() {
    const { label, granularityDateSelection, config } = this.props;
    const {
      selectedTab,
      isSelectionTooLarge,
      maxReportMonths,
      tempDateSelection
    } = this.state;
    return (
      <div>
        {label && <span className="dropdown-label">{label}</span>}
        <div
          className={classnames('dropdown', {
            open: this.state.open
          })}
        >
          <div className="dropdown-overlay" onClick={this.toggle} />
          <a className="button with-right-chevron" onClick={this.toggle}>
            <span>{this.dateRange(granularityDateSelection)}</span>
            <span className="chevron down" />
          </a>
          <div className="dropdown-menu">
            <DateSelectorTabs horizontal>
              {config.all && (
                <DateSelectorTab active={selectedTab === 'all'}>
                  <DateSelectorTabButton
                    title="All"
                    onClick={e => this.changeTab(e, 'all')}
                  />
                </DateSelectorTab>
              )}
              {config.compare && (
                <DateSelectorTab active={selectedTab === 'compare'}>
                  <DateSelectorTabButton
                    title="Compare Dates"
                    onClick={e => this.changeTab(e, 'compare')}
                  />
                </DateSelectorTab>
              )}
              {config.range && (
                <DateSelectorTab active={selectedTab === 'range'}>
                  <DateSelectorTabButton
                    title="Date Range"
                    onClick={e => this.changeTab(e, 'range')}
                  />
                </DateSelectorTab>
              )}
            </DateSelectorTabs>
            <DateSelector>
              {selectedTab === 'single' && (
                <ReportDatePicker
                  dateSelection={tempDateSelection}
                  onUpdate={this.handleDateSelectionUpdate}
                />
              )}
              {selectedTab === 'range' && (
                <ReportDateRangePicker
                  dateSelection={tempDateSelection}
                  onUpdate={this.handleDateSelectionUpdate}
                />
              )}
              {selectedTab === 'compare' && (
                <ReportGranularitySelector
                  dateSelection={tempDateSelection}
                  onUpdate={this.handleDateSelectionUpdate}
                />
              )}
              <DateSelectorFooter>
                <DateSelectorFooterSection left>
                  {selectedTab === 'single' && (
                    <span>
                      <a href="" onClick={this.selectToday}>
                        Today
                      </a>
                    </span>
                  )}
                  {selectedTab !== 'single' && (
                    <DateSelectorPreview>
                      {this.dateRange(tempDateSelection)}
                    </DateSelectorPreview>
                  )}
                  <br />
                  {isSelectionTooLarge && (
                    <span className="vd-text--negative vd-text-supplementary">
                      <i className="fa fa-exclamation-triangle" />
                      Please choose a date range that isn't wider than{' '}
                      {maxReportMonths} months
                    </span>
                  )}
                </DateSelectorFooterSection>
                <DateSelectorFooterSection right>
                  <RBButton
                    category="primary"
                    disabled={isSelectionTooLarge}
                    onClick={this.confirmDateSelection}
                  >
                    Apply
                  </RBButton>
                </DateSelectorFooterSection>
              </DateSelectorFooter>
            </DateSelector>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportDateSelector;
