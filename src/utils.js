import moment from "moment";
const findDayOfYear = function(date) {
  var oneDay = 1000 * 60 * 60 * 24; // A day in milliseconds
  var og = {
    // Saving original data
    ts: date.getTime(),
    dom: date.getDate(), // We don't need to save hours/minutes because DST is never at 12am.
    month: date.getMonth()
  };
  date.setDate(1); // Sets Date of the Month to the 1st.
  date.setMonth(0); // Months are zero based in JS's Date object
  var start_ts = date.getTime(); // New Year's Midnight JS Timestamp
  var diff = og.ts - start_ts;

  date.setDate(og.dom); // Revert back to original date object
  date.setMonth(og.month); // This method does preserve timezone
  return Math.round(diff / oneDay) + 1; // Deals with DST globally. Ceil fails in Australia. Floor Fails in US.
};

const createCalendarHelper = function(startYear, endYear) {
  let calendarHelper = {};
  let totalDays;

  for (let y = startYear; y <= endYear; y++) {
    let isLeapYear = moment([y]).isLeapYear();

    let gridSize;
    let gridLayout = [];

    for (let i = 0; i < 12; i++) {
      let obj = {};

      if (isLeapYear) {
        totalDays = 366;
      } else {
        totalDays = 365;
      }

      obj.firstDayOfTheMonth = new Date(y, i, 1);
      obj.isLeapYear = isLeapYear;

      obj.dayNumber = findDayOfYear(obj.firstDayOfTheMonth);
      obj.startDayOfWeek = obj.firstDayOfTheMonth.getDay();
      let startGridNumber = obj.dayNumber - obj.startDayOfWeek - 1;
      if (startGridNumber < 0) {
        startGridNumber = startGridNumber + totalDays;
      }
      obj.startGridNumber = startGridNumber;
      if (obj.startDayOfWeek > 3) {
        gridSize = 42;
      } else {
        gridSize = 35;
      }
      obj.gridSize = gridSize;
      gridLayout.push(obj);
    }

    calendarHelper[y] = gridLayout;
  }
  return calendarHelper;
};

export { findDayOfYear, createCalendarHelper };
