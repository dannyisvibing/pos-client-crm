import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import RBPopover, {
  RBPopoverTarget,
  RBPopoverContainer,
  RBPopoverContent
} from '../../../rombostrap/components/RBPopover';
import 'react-day-picker/lib/style.css';

class DatePicker extends PureComponent {
  state = {};

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleInputClick = () => {
    this.setState({ open: true });
  };

  handleDayClick = day => {
    this.setState({ open: false }, () => this.props.onSelectDay(day));
  };

  render() {
    const { id, placeholder, date } = this.props;

    return (
      <RBPopover
        id={id}
        targetBottom
        targetLeft
        containerTop
        containerLeft
        flow
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
      >
        <RBPopoverTarget>
          <div style={{ position: 'relative' }} onClick={this.handleInputClick}>
            <input
              className="vd-input vd-datepicker-range-input vd-input--icon-right"
              placeholder={placeholder}
              value={date ? moment(date).format('Do MMM YYYY') : ''}
              onChange={() => {}}
            />
            <i className="fa fa-calendar vd-input-icon vd-input-icon--right" />
          </div>
        </RBPopoverTarget>
        <RBPopoverContainer>
          <RBPopoverContent>
            <DayPicker
              numberOfMonths={1}
              selectedDays={moment(date).toDate() || new Date()}
              onDayClick={this.handleDayClick}
            />
          </RBPopoverContent>
        </RBPopoverContainer>
      </RBPopover>
    );
  }
}

DatePicker.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string
};

DatePicker.defaultProps = {
  id: 'default-datepicker'
};

export default DatePicker;
