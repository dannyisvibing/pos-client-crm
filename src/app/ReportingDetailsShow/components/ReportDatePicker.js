import React, { Component } from 'react';
import moment from 'moment';
import GranularityDefinitionsService from '../../../modules/reporting/granularity-definitions.service';
import DayPicker from 'react-day-picker';

class ReportDatePicker extends Component {
  state = {
    startDate: new Date(),
    minDate: new Date(),
    maxDate: new Date(),
    inputDate: new Date()
  };

  componentWillMount() {
    const { dateSelection } = this.props;
    var startDate = moment(
      dateSelection.startDate || dateSelection.period.start
    ).toDate();
    var minDate = dateSelection.minDate;
    var maxDate = moment()
      .add(1, 'day')
      .toDate();
    this.setState({
      startDate: startDate,
      minDate,
      maxDate,
      inputDate: moment(startDate).format('YYYY-MM-DD')
    });
    this.dateGranularity = GranularityDefinitionsService.findByKey('single');
    this.update = this.update.bind(this);
  }

  handleDateChange = e => {
    this.setState({ inputDate: e.target.value });
  };

  handleDateUpdate = e => {
    this.setState({ startDate: new Date(this.state.inputDate) }, this.update);
  };

  handleDayClick = day => {
    this.setState(
      {
        inputDate: moment(day).format('YYYY-MM-DD'),
        startDate: day
      },
      this.update
    );
  };

  update(day) {
    const { onUpdate } = this.props;
    var update = {
      granularity: this.dateGranularity,
      periodType: 'single',
      startDate: moment(this.state.startDate)
    };
    onUpdate && onUpdate(update);
  }

  render() {
    const { minDate, maxDate, startDate, inputDate } = this.state;
    return (
      <div>
        <div className="reporting-date-picker-input-group">
          <div className="reporting-date-picker-input-group-item">
            <input
              type="date"
              placeholder="yyyy-MM-dd"
              className="reporting-date-picker-input"
              value={inputDate}
              onChange={this.handleDateChange}
              onBlur={this.handleDateUpdate}
              required
            />
          </div>
        </div>
        <div className="reporting-date-picker-container">
          <div className="reporting-date-stamp">
            <DayPicker
              numberOfMonths={1}
              fromMonth={minDate}
              toMonth={maxDate}
              month={startDate}
              disabledDays={[
                {
                  before: minDate
                },
                {
                  after: maxDate
                }
              ]}
              selectedDays={startDate}
              onDayClick={this.handleDayClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ReportDatePicker;
