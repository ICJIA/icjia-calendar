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

const createEventHTML = function(dayObj, store) {
  let truncateAfter = 15;
  let eventData = store.state.data;
  let year = store.state.currentYear;
  let backgroundStyle;
  if (dayObj.month - 1 === store.state.currentMonth - 1) {
    backgroundStyle = "background-color: #fff ; width: 100%; color: #333 ;";
  } else {
    backgroundStyle = "background-color: #eee ; width: 100%; color: #aaa ";
  }

  if (moment().dayOfYear() === dayObj.dayOfYear) {
    backgroundStyle = "background-color: #999; width: 100%; color: #000 ";
  }

  let dayEvents = "";
  if (eventData[year]) {
    if (eventData[year][dayObj.dayOfYear]) {
      dayEvents = eventData[year][dayObj.dayOfYear];
    }
  }
  let html = `<span style="${backgroundStyle}; ">${dayObj.day}`;
  if (dayEvents) {
    dayEvents.forEach(x => {
      let text, filler, strLength, marginLeft, marginRight;
      if (store.state.visibleEvents.includes(x.color)) {
        if (x.isStart) {
          text = stringTruncate(x.description, truncateAfter);
          marginLeft = "15px";
        } else {
          strLength = x.description.strLength;
          filler = `&nbsp`;
          text = filler.repeat(truncateAfter);
          marginLeft = "0px";
        }

        if (x.isFinish) {
          marginRight = "15px";
        } else {
          marginRight = "0px";
        }

        html =
          html +
          `<div style="font-size: 12px; background: ${
            x.color
          }; color: #fff; margin-bottom: 2px; font-size: 8px; padding: 2px; font-weight: 900; text-transform: uppercase; margin-left: ${marginLeft};margin-right: ${marginRight};" class="event">${text}</div>`;
      }
    });
  }

  if (store.state.debug) {
    html = html + `<div style="font-weight: bold; font-size: 12px;">`;
    html = html + `<div >Day: ${dayObj.dayOfYear}</div>`;
    html = html + `<div >gridID: ${dayObj.gridID}</div>`;
    html = html + `<div >${dayObj.fullDate}</div>`;
    html = html + `<div >${dayObj.year}</div>`;
    html = html + `</div>`;
  }
  html = html + `</span>`;

  return html;
};

export { createEventHTML, findDayOfYear, createCalendarHelper, stringTruncate };
