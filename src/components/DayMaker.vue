<template>
  <div>
    <li v-html="getDayMeta(gridID)" @click="sheet = true"></li>
  </div>
</template>

<script>
const moment = require("moment");
import { stringTruncate, createCalendarHelper } from "@/utils";
import _ from "lodash";
const data = require("@/api/index.json");
export default {
  props: {
    gridID: {
      type: Number
    }
  },
  data() {
    return {
      currentMonth: 12,
      currentYear: 2018,
      minYear: 2018,
      maxYear: 2020,
      debug: true,
      calendarMeta: [],
      isVisible: this.$store.state.visibleEvents,
      truncateAfter: 15,
      colors: this.$store.state.eventColors,
      data: data,
      sheet: false
    };
  },
  created() {
    this.$store.dispatch(
      "setCalendarMeta",
      createCalendarHelper(this.minYear, this.maxYear)
    );
    this.calendarMeta = this.$store.state.calendarMeta;
    this.isVisible = this.$store.state.eventColors.map(x => {
      return x;
    });
    this.$store.dispatch("initVisibleEvents");

    // console.log(this.calendarMeta[this.currentYear][this.currentMonth-1].gridSize)
  },
  methods: {
    getDayMeta(gridID) {
      let backgroundStyle;
      let dayObj = {};
      let year = this.currentYear;
      let dayOfYear;
      let splitYear = false;
      let totalDays;
      dayObj.gridID = gridID;

      if (
        this.calendarMeta[this.currentYear][this.currentMonth - 1].isLeapYear
      ) {
        totalDays = 366;
      } else {
        totalDays = 365;
      }
      if (
        this.calendarMeta[this.currentYear][this.currentMonth - 1]
          .startGridNumber +
          dayObj.gridID >
        totalDays
      ) {
        dayOfYear =
          this.calendarMeta[this.currentYear][this.currentMonth - 1]
            .startGridNumber +
          dayObj.gridID -
          totalDays;
        splitYear = true;
      } else {
        dayOfYear =
          this.calendarMeta[this.currentYear][this.currentMonth - 1]
            .startGridNumber + dayObj.gridID;
        splitYear = false;
      }

      dayObj.dayOfYear = dayOfYear;

      // pad December with next month
      if (splitYear && this.currentMonth === 12) {
        year = year + 1;
      }
      // pad January with previous month
      if (this.currentMonth === 1 && dayObj.dayOfYear > 335) {
        year = year - 1;
      }
      dayObj.fullDate = moment([year]).dayOfYear(dayObj.dayOfYear);
      dayObj.day = moment(dayObj.fullDate).format("DD");
      dayObj.month = moment(dayObj.fullDate).format("MM");
      dayObj.year = moment(dayObj.fullDate).format("YYYY");

      if (dayObj.month - 1 === this.currentMonth - 1) {
        backgroundStyle = "background-color: #fff ; width: 100%; color: #333 ;";
      } else {
        backgroundStyle = "background-color: #eee ; width: 100%; color: #aaa ";
      }

      if (moment().dayOfYear() === dayObj.dayOfYear) {
        backgroundStyle = "background-color: #999; width: 100%; color: #000 ";
      }

      let dayEvents = "";
      if (data[year]) {
        if (data[year][dayObj.dayOfYear]) {
          dayEvents = data[year][dayObj.dayOfYear];
        }
      }

      let html = `<span style="${backgroundStyle}; ">${dayObj.day}`;
      if (dayEvents) {
        dayEvents.forEach(x => {
          let text, filler, strLength, marginLeft, marginRight;
          if (this.isVisible.includes(x.color)) {
            if (x.isStart) {
              text = stringTruncate(x.description, this.truncateAfter);
              marginLeft = "15px";
            } else {
              strLength = x.description.strLength;
              filler = `&nbsp`;
              text = filler.repeat(this.truncateAfter);
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

      if (this.$store.state.debug) {
        html = html + `<div style="font-weight: bold; font-size: 12px;">`;
        html = html + `<div >Day: ${dayObj.dayOfYear}</div>`;
        html = html + `<div >gridID: ${dayObj.gridID}</div>`;
        html = html + `<div >${dayObj.fullDate}</div>`;
        html = html + `<div >${dayObj.year}</div>`;
        html = html + `</div>`;
      }
      html = html + `</span>`;
      return html;
    },
    nextMonth() {
      if (this.currentMonth === 12 && this.currentYear === this.maxYear) {
        this.currentMonth = 12;
        this.currentYear = this.maxYear;
      } else if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    lastMonth() {
      if (this.currentMonth === 1 && this.currentYear === this.minYear) {
        this.currentMonth = 1;
        this.currentYear = this.minYear;
      } else if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    toggleEvents(color) {
      if (this.isVisible.includes(color)) {
        this.isVisible = _.remove(this.isVisible, function(n) {
          return n !== color;
        });
        this.$store.dispatch("setVisibleEvents", this.isVisible);
      } else {
        this.isVisible.push(color);
        this.$store.dispatch("setVisibleEvents", this.isVisible);
      }
    }
  },
  computed: {
    currentDate() {
      let date = new Date(this.currentYear, this.currentMonth - 1, 1);
      return moment(date).format("MMMM YYYY");
    },
    gridSize() {
      return this.calendarMeta[this.currentYear][this.currentMonth - 1]
        .gridSize;
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>