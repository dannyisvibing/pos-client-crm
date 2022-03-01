import React from 'react';
import moment from 'moment';
import classnames from 'classnames';

import granularityDateFilter from '../../../modules/reporting/utils/granularityDate';
import granularityDateRangeFilter from '../../../modules/reporting/utils/granularityDateRange';

function endDate(granularityDateSelection) {
  var dateFormat, granularityKey, startDate;
  granularityKey = granularityDateSelection.granularity.key;
  if (granularityKey === 'day') {
    return granularityDateFilter(granularityDateSelection.getPeriodEndDate());
  } else {
    startDate = moment(granularityDateSelection.getPeriodEndDate()).startOf(
      granularityKey
    );
    dateFormat = 'Do MMM YYYY';
    return granularityDateRangeFilter(
      startDate,
      granularityDateSelection.getPeriodEndDate(),
      dateFormat
    );
  }
}

function canShiftUp(granularityDateSelection) {
  return granularityDateSelection.canShiftSelectedDateUp();
}

function granularityClass(granularityDateSelection) {
  return granularityDateSelection.granularity.key;
}

const GranularityDateShifter = ({
  granularityDateSelection,
  onPrev,
  onNext
}) => (
  <ul className="button-group date-shifter">
    <li>
      <a className="button secondary" onClick={onPrev}>
        <span className="icon">
          <i className="fa fa-arrow-left" />
        </span>
      </a>
    </li>
    <li>
      <a
        className={classnames(
          'button date',
          granularityClass(granularityDateSelection)
        )}
      >
        <strong>{endDate(granularityDateSelection)}</strong>
      </a>
    </li>
    <li>
      <a
        className={classnames('button secondary', {
          disabled: !canShiftUp(granularityDateSelection)
        })}
        onClick={onNext}
      >
        <span className="icon">
          <i className="fa fa-arrow-right" />
        </span>
      </a>
    </li>
  </ul>
);

export default GranularityDateShifter;
