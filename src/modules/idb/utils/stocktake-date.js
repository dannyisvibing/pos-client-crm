function createDate(dateStr, timeStr) {
  var dateArray = dateStr.match(/(\d{2}).(\d{2}).(\d{4})/),
    timeArray = timeStr.match(/(\d{1,2}):(\d{2})\s{0,1}(am|pm)/i),
    year,
    month,
    day,
    hours,
    minutes,
    meridiem;

  // Check if valid date and time fields
  if (dateArray && timeArray) {
    year = dateArray[3];
    // @note Decrease month value by 1, because month is Zero based (0 = Jan, 1 = Feb etc.)
    month = +dateArray[2] - 1;
    day = dateArray[1];
    hours = timeArray[1];
    minutes = timeArray[2];
    meridiem = timeArray[3].toLowerCase();

    if (meridiem === 'pm' && hours !== '12') {
      // If hours in pm convert to 24hr time by adding 12 hours
      hours = +hours + 12;
    } else if (meridiem === 'am' && hours === '12') {
      // If midnight, set hours to 0
      hours = 0;
    }
  }

  // Create date using numbered values, as there are problems with safari parsing date strings
  return new Date(year, month, day, hours, minutes);
}

export default createDate;
