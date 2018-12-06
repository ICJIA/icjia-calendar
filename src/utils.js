import moment from "moment";
import _ from "lodash";

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
      obj.totalDays = totalDays;
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

const stringTruncate = function(str, length) {
  var dots = str.length > length ? "..." : "";
  return str.substring(0, length) + dots;
};

const getDayMeta = function(gridID, store) {
  let state = store.state;
  let dayObj = {};
  let year = state.currentYear;
  let dayOfYear;
  let splitYear = false;
  let totalDays;
  let eventData = state.apiData;

  dayObj.gridID = gridID;

  if (
    state.calendarMeta[state.currentYear][state.currentMonth - 1].isLeapYear
  ) {
    totalDays = 366;
  } else {
    totalDays = 365;
  }
  if (
    state.calendarMeta[state.currentYear][state.currentMonth - 1]
      .startGridNumber +
      dayObj.gridID >
    totalDays
  ) {
    dayOfYear =
      state.calendarMeta[state.currentYear][state.currentMonth - 1]
        .startGridNumber +
      dayObj.gridID -
      totalDays;
    splitYear = true;
  } else {
    dayOfYear =
      state.calendarMeta[state.currentYear][state.currentMonth - 1]
        .startGridNumber + dayObj.gridID;
    splitYear = false;
  }

  dayObj.dayOfYear = dayOfYear;

  // pad December with next month
  if (splitYear && state.currentMonth === 12) {
    year = year + 1;
  }
  // pad January with previous month
  if (state.currentMonth === 1 && dayObj.dayOfYear > 335) {
    year = year - 1;
  }
  dayObj.fullDate = moment([year]).dayOfYear(dayObj.dayOfYear);
  dayObj.day = moment(dayObj.fullDate).format("DD");
  dayObj.month = moment(dayObj.fullDate).format("MM");
  dayObj.year = moment(dayObj.fullDate).format("YYYY");
  // add events

  // console.log(
  //   "has day: ",
  //   dayOfYear,
  //   _.has(eventData[state.currentYear], dayOfYear)
  // );

  if (
    _.has(eventData, state.currentYear) &&
    _.has(eventData[state.currentYear], dayOfYear)
  ) {
    dayObj.dayEvents = eventData[state.currentYear][dayOfYear];
  } else {
    dayObj.dayEvents = [];
  }

  // dayObj.dayEvents = [];

  return dayObj;
};

export { getDayMeta, findDayOfYear, createCalendarHelper, stringTruncate };
