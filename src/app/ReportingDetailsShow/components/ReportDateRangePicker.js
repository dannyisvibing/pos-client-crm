import React, { Component } from 'react';
import moment from 'moment';
import Helmet from 'react-helmet';
import GranularityDefinitionsService from '../../../modules/reporting/granularity-definitions.service';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class ReportDateRangePicker extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date()
  };

  componentWillMount() {
    const { dateSelection } = this.props;
    var minDateSelection = dateSelection.minDate;
    var startDate = moment(
      dateSelection.startDate || dateSelection.period.start
    ).toDate();
    var endDate = moment(
      dateSelection.endDate || dateSelection.period.end
    ).toDate();
    if (minDateSelection) {
      startDate = moment(startDate).isAfter(minDateSelection)
        ? startDate
        : minDateSelection;
    }
    var inputRange = {
      start: moment(startDate).format('YYYY-MM-DD'),
      end: moment(endDate).format('YYYY-MM-DD')
    };
    this.setState({
      startDate,
      endDate,
      inputRange
    });
    this.rangeGranularity = GranularityDefinitionsService.findByKey('range');
    this.update = this.update.bind(this);
  }

  handleInputChange = (e, isFrom) => {
    var { inputRange } = this.state;
    if (isFrom) {
      inputRange.start = e.target.value;
    } else {
      inputRange.end = e.target.value;
    }
    this.setState({ inputRange });
  };

  handleInputBlur = (e, isFrom) => {
    if (isFrom) {
      this.setState({ startDate: new Date(e.target.value) }, this.update);
    } else {
      this.setState({ endDate: new Date(e.target.value) }, this.update);
    }
  };

  handleStartDayClick = day => {
    const { dateSelection } = this.props;
    var minDate = dateSelection.minDate;
    if (minDate && !moment(day).isAfter(minDate)) {
      day = minDate;
    }
    this.setState({ startDate: moment(day).toDate() }, this.update);
  };

  handleEndDayClick = day => {
    this.setState({ endDate: moment(day).toDate() }, this.update);
  };

  update() {
    const { onUpdate } = this.props;
    var update = {
      granularity: this.rangeGranularity,
      periodType: 'range',
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };
    onUpdate && onUpdate(update);
  }

  render() {
    const { dateSelection } = this.props;
    const { startDate, endDate, inputRange } = this.state;
    const modifiers = { start: startDate, end: endDate };
    const minDate = dateSelection.minDate;

    return (
      <div>
        <div className="reporting-date-picker-input-group">
          <div className="reporting-date-picker-input-group-item">
            <label className="reporting-date-picker-label">From:</label>
            <input
              type="date"
              placeholder="yyyy-MM-dd"
              className="reporting-date-picker-input"
              value={inputRange.start}
              onChange={e => this.handleInputChange(e, true)}
              onBlur={e => this.handleInputBlur(e, true)}
              required
            />
          </div>
          <div className="reporting-date-picker-input-group-item">
            <label className="reporting-date-picker-label">To:</label>
            <input
              type="date"
              placeholder="yyyy-MM-dd"
              className="reporting-date-picker-input"
              value={inputRange.end}
              onChange={e => this.handleInputChange(e, false)}
              onBlur={e => this.handleInputBlur(e, false)}
              required
            />
          </div>
        </div>
        <div className="reporting-date-picker-container">
          <div className="reporting-date-picker-range reporting-date-picker-range--left">
            <DayPicker
              className="Selectable"
              month={startDate}
              toMonth={endDate}
              disabledDays={[
                {
                  before: minDate
                },
                {
                  after: endDate
                }
              ]}
              modifiers={modifiers}
              selectedDays={[startDate, { from: startDate, to: endDate }]}
              onDayClick={this.handleStartDayClick}
            />
          </div>
          <div className="reporting-date-picker-range reporting-date-picker-range--left">
            <DayPicker
              className="Selectable"
              fromMonth={startDate}
              month={endDate}
              disabledDays={[
                {
                  before: startDate
                }
              ]}
              modifiers={modifiers}
              selectedDays={[startDate, { from: startDate, to: endDate }]}
              onDayClick={this.handleEndDayClick}
            />
          </div>
        </div>
        <Helmet>
          <style>{`
                        .Selectable .DayPicker-Day {
                            border: unset;
                        }
                        .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                            color: inherit;
                            background-color: #E5F3E4;
                        }
                        .Selectable .DayPicker-Months {
                            flex-wrap: unset;
                        }
                        .Selectable .DayPicker-Day {
                            border-radius: 0 !important;
                        }
                        .Selectable .DayPicker-Day--start {
                            border-top-left-radius: 50% !important;
                            border-bottom-left-radius: 50% !important;
                        }
                        .Selectable .DayPicker-Day--end {
                            border-top-right-radius: 50% !important;
                            border-bottom-right-radius: 50% !important;
                        }
                    `}</style>
        </Helmet>
      </div>
    );
  }
}

export default ReportDateRangePicker;
