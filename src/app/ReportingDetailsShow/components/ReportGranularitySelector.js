import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import DefaultGranularityDefinition from '../../../modules/reporting/factories/default-granularity-definition';

import {
  DateSelectorTabs,
  DateSelectorTab,
  DateSelectorTabButton,
  DateSelectorContent,
  DateSelectorOptions,
  DateSelectorOption
} from './ReportDateSelector+Layout';
import GranularityDateSelect from './GranularityDateSelect';

class ReportGranularitySelector extends Component {
  state = {
    periodType: null,
    periodCount: 0,
    selectedDate: null,
    granularity: null
  };

  componentWillMount() {
    const { dateSelection } = this.props;
    var granularities = DefaultGranularityDefinition.filter(function(d) {
      return !d.hidden;
    });
    this.setState({
      granularities,
      periodType: dateSelection.periodType,
      periodCount: _.parseInt(dateSelection.periodCount),
      selectedDate: moment(dateSelection.selectedDate).toDate(),
      granularity: dateSelection.granularity
    });
    this.update = this.update.bind(this);
  }

  isActiveGranularity(granularityKey) {
    return this.state.granularity.key === granularityKey;
  }

  isActivePeriodType(periodType) {
    return this.state.periodType === periodType;
  }

  select(granularity) {
    this.setState({ granularity }, this.update);
  }

  selectPeriodType(periodType) {
    this.setState({ periodType }, this.update);
  }

  setPeriodCount = e => {
    this.setState({ periodCount: _.parseInt(e.target.value) }, this.update);
  };

  setSelectedDate = selectedDate => {
    this.setState({ selectedDate }, this.update);
  };

  update() {
    const { onUpdate } = this.props;
    var update = {
      granularity: this.state.granularity,
      periodType: this.state.periodType,
      periodCount: this.state.periodCount,
      selectedDate: this.state.selectedDate
    };
    onUpdate && onUpdate(update);
  }

  render() {
    const {
      granularities,
      periodType,
      periodCount,
      granularity,
      selectedDate
    } = this.state;

    return (
      <div>
        <DateSelectorTabs>
          {granularities.map((granularity, i) => (
            <DateSelectorTab
              key={i}
              active={this.isActiveGranularity(granularity.key)}
              onClick={() => this.select(granularity)}
            >
              <DateSelectorTabButton title={granularity.name} />
            </DateSelectorTab>
          ))}
          <DateSelectorContent>
            <DateSelectorOptions>
              <DateSelectorOption
                onClick={e => this.selectPeriodType('to_date')}
                active={this.isActivePeriodType('to_date')}
              >
                <input
                  id="period_type_to_date"
                  className="radio"
                  type="radio"
                  checked={periodType === 'to_date'}
                  onChange={e => {}}
                />
                <label className="radio-handle" htmlFor="period_type_to_date">
                  {granularity.name} to date
                </label>
              </DateSelectorOption>
              <DateSelectorOption
                onClick={e => this.selectPeriodType('last_granularity')}
                active={this.isActivePeriodType('last_granularity')}
              >
                <input
                  id="period_type_last_granularity"
                  type="radio"
                  className="radio"
                  checked={periodType === 'last_granularity'}
                  onChange={e => {}}
                />
                <label
                  className="radio-handle"
                  htmlFor="period_type_last_granularity"
                >
                  Previous {granularity.name.toLowerCase()}
                </label>
              </DateSelectorOption>
              <DateSelectorOption
                onClick={e => this.selectPeriodType('last')}
                active={this.isActivePeriodType('last')}
              >
                <input
                  id="period_type_last"
                  type="radio"
                  className="radio"
                  checked={periodType === 'last'}
                  onChange={e => {}}
                />
                <label className="radio-handle" htmlFor="period_type_last">
                  Last
                </label>
                <input
                  id="period_count_last"
                  type="number"
                  className="date-selector-period-count"
                  min="1"
                  value={periodCount}
                  onChange={this.setPeriodCount}
                  required={periodType === 'last'}
                />
                <label htmlFor="period_count_last">
                  {granularity.name.toLowerCase()}s
                </label>
              </DateSelectorOption>
              <DateSelectorOption
                onClick={e => this.selectPeriodType('last_beginning')}
                active={this.isActivePeriodType('last_beginning')}
              >
                <input
                  id="period_type_last_beginning"
                  type="radio"
                  className="radio"
                  checked={periodType === 'last_beginning'}
                  onChange={e => {}}
                />
                <label
                  htmlFor="period_type_last_beginning"
                  className="radio-handle"
                />
                <input
                  id="period_count_last_beginning"
                  type="number"
                  className="date-selector-period-count"
                  min="1"
                  value={periodCount}
                  onChange={this.setPeriodCount}
                  required={periodType === 'last_beginning'}
                />
                <label htmlFor="period_count_last_beginning">
                  {granularity.name.toLowerCase()}s,{' '}
                </label>
                <label htmlFor="period_type_last_beginning">from</label>
                <GranularityDateSelect
                  classes="date-selector-inline-select"
                  granularity={granularity.key}
                  selectedDate={selectedDate}
                  onUpdate={this.setSelectedDate}
                />
              </DateSelectorOption>
            </DateSelectorOptions>
          </DateSelectorContent>
        </DateSelectorTabs>
      </div>
    );
  }
}

export default ReportGranularitySelector;
