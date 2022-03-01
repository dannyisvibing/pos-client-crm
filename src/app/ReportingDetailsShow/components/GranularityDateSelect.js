import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

class GranularityDateSelect extends Component {
  state = {
    years: [],
    months: [],
    days: [],
    hours: [],
    quarters: [],
    quarter: null,
    year: null,
    month: null,
    day: null,
    hour: null,
    hourPeriod: null,
    selectOptions: {}
  };

  componentWillMount() {
    var years = this.getYearList();
    var months = moment.months();
    var hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    hours.unshift(12);
    var quarters = [
      {
        value: 1,
        text: 'Q1'
      },
      {
        value: 2,
        text: 'Q2'
      },
      {
        value: 3,
        text: 'Q3'
      },
      {
        value: 4,
        text: 'Q4'
      }
    ];
    var quarter = _.first(quarters);
    this.setState({
      years,
      months,
      hours,
      quarters,
      quarter
    });
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    const { granularity } = this.props;
    const { granularity: nextGranularity } = nextProps;
    if (granularity !== nextGranularity) {
      this.init();
    }
  }

  init() {
    this.setFormValues(() => {
      this.updateOptionList();
      this.updateSelectedDate();
    });
  }

  getDaysList() {
    var daysInMonth, _results;
    var { month, year } = this.state;
    daysInMonth = moment()
      .year(year)
      .month(month)
      .daysInMonth();
    return function() {
      _results = [];
      for (
        var _i = 1;
        1 <= daysInMonth ? _i <= daysInMonth : _i >= daysInMonth;
        1 <= daysInMonth ? _i++ : _i--
      ) {
        _results.push(_i);
      }
      return _results;
    }.apply(this);
  }

  getYearList(range) {
    var currentYear, year;
    if (range == null) {
      range = 10;
    }
    currentYear = moment().year();
    return (function() {
      var _i, _ref, _results;
      _results = [];
      for (
        year = _i = currentYear, _ref = currentYear - range;
        currentYear <= _ref ? _i <= _ref : _i >= _ref;
        year = currentYear <= _ref ? ++_i : --_i
      ) {
        _results.push(year);
      }
      return _results;
    })();
  }

  setFormValues(cb) {
    var selectedDateMoment;
    selectedDateMoment = moment(this.props.selectedDate);
    this.setState(
      {
        year: selectedDateMoment.year(),
        month: selectedDateMoment.format('MMMM'),
        day: selectedDateMoment.day(),
        hour: selectedDateMoment.format('h'),
        hourPeriod: selectedDateMoment.format('a')
      },
      cb
    );
  }

  updateOptionList() {
    const { granularity } = this.props;
    var visibleOptions;
    switch (granularity) {
      case 'month':
        visibleOptions = {
          month: true,
          year: true
        };
        break;
      case 'quarter':
        visibleOptions = {
          quarter: true,
          year: true
        };
        break;
      case 'year':
        visibleOptions = {
          year: true
        };
        break;
      case 'hour':
        visibleOptions = {
          day: true,
          month: true,
          year: true,
          hour: true
        };
        break;

      default:
        visibleOptions = {
          day: true,
          month: true,
          year: true
        };
        break;
    }

    var days = [];
    if (visibleOptions.day) {
      days = this.getDaysList();
    }
    this.setState({
      selectOptions: visibleOptions,
      days: days
    });
  }

  updateSelectedDate() {
    const { quarter, month, day, hour, hourPeriod } = this.state;
    const { granularity, onUpdate } = this.props;
    var selectedDate, selectedHour;
    selectedDate = moment();
    selectedDate.year(this.state.year);
    if (granularity === 'quarter') {
      selectedDate.quarter(quarter);
    } else {
      selectedDate.month(month).date(day);
    }
    if (granularity === 'hour') {
      selectedHour = moment(hour + hourPeriod, ['ha']).hour();
      selectedDate.hour(selectedHour).startOf('hour');
    } else {
      selectedDate.startOf('day');
    }
    onUpdate && onUpdate(selectedDate.toDate());
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value }, () => {
      this.updateOptionList();
      this.updateSelectedDate();
    });
  };

  render() {
    const {
      selectOptions,
      day,
      days,
      month,
      months,
      quarter,
      quarters,
      year,
      years,
      hour,
      hours,
      hourPeriod
    } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes}>
        {selectOptions.day && (
          <select
            value={day}
            onChange={e => this.handleChange('day', e.target.value)}
          >
            {days.map((day, i) => (
              <option key={i} value={day}>
                {day}
              </option>
            ))}
          </select>
        )}
        {selectOptions.month && (
          <select
            value={month}
            onChange={e => this.handleChange('month', e.target.value)}
          >
            {months.map((month, i) => (
              <option key={i} value={month}>
                {month}
              </option>
            ))}
          </select>
        )}
        {selectOptions.quarter && (
          <select
            value={quarter}
            onChange={e => this.handleChange('quarter', e.target.value)}
          >
            {quarters.map((quarter, i) => (
              <option key={i} value={quarter.value}>
                {quarter.text}
              </option>
            ))}
          </select>
        )}
        {selectOptions.year && (
          <select
            value={year}
            onChange={e => this.handleChange('year', e.target.value)}
          >
            {years.map((year, i) => (
              <option key={i} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
        {selectOptions.hour && (
          <select
            value={hour}
            onChange={e => this.handleChange('hour', e.target.value)}
          >
            {hours.map((hour, i) => (
              <option key={i} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        )}
        {selectOptions.hour && (
          <select
            value={hourPeriod}
            onChange={e => this.handleChange('hourPeriod', e.target.value)}
          >
            <option value="am">am</option>
            <option value="pm">pm</option>
          </select>
        )}
      </div>
    );
  }
}

export default GranularityDateSelect;
