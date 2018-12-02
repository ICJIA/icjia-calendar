<template>
  <div>
    <v-layout row wrap class="mb-5">
      <v-flex xs12>
        <header>
          <v-btn fab dark small color="grey" @click="lastMonth()">
            <v-icon dark>remove</v-icon>
          </v-btn>&nbsp;
          <h1>{{currentDate}}</h1>&nbsp;
          <v-btn fab dark small color="grey" @click="nextMonth()">
            <v-icon dark>add</v-icon>
          </v-btn>
        </header>
      </v-flex>

      <v-flex xs12 sm9>
        <div class="calendar">
          <ul class="weekdays">
            <li>
              <abbr title="S">Sunday</abbr>
            </li>
            <li>
              <abbr title="M">Monday</abbr>
            </li>
            <li>
              <abbr title="T">Tuesday</abbr>
            </li>
            <li>
              <abbr title="W">Wednesday</abbr>
            </li>
            <li>
              <abbr title="T">Thursday</abbr>
            </li>
            <li>
              <abbr title="F">Friday</abbr>
            </li>
            <li>
              <abbr title="S">Saturday</abbr>
            </li>
          </ul>

          <ul class="day-grid">
            <div v-for="i in gridSize" :key="`1${i}`">
              <li v-html="getDayMeta(i)"></li>
              <!-- <day-meta :gridID="i"/> -->
            </div>
          </ul>
        </div>
      </v-flex>
      <v-flex xs12 sm3 class="pl-5 mt-5">
        <div v-for="color in this.$store.state.eventColors" :key="color">
          <v-switch
            :label="color"
            :v-model="color"
            input-value="true"
            @click.native="toggleEvents(color)"
          ></v-switch>
        </div>
      </v-flex>
    </v-layout>
    <div v-if="this.$store.state.debug">
      <v-layout row wrap class="pl-5 pr-5">
        <v-flex xs12>
          <div>
            <h2
              style="border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 15px;"
            >Debug:</h2>
            <h4>isVisible:</h4>
            <div>{{this.isVisible}}</div>
            <h4>calendarMeta:</h4>
            <div>{{this.calendarMeta}}</div>
            <h4>api:</h4>
            <div>{{this.data}}</div>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
const moment = require("moment");
import { stringTruncate, findDayOfYear, createCalendarHelper } from "@/utils";
import _ from "lodash";
import DayMeta from "@/components/DayMeta";
const data = require("@/api/index.json");
export default {
  components: {
    DayMeta
  },
  data() {
    return {
      currentMonth: 12,
      currentYear: 2018,
      minYear: 2018,
      maxYear: 2020,
      debug: true,
      calendarMeta: [],
      isVisible: [],
      truncateAfter: 15,
      colors: this.$store.state.eventColors,
      data: data
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
        backgroundStyle = "background-color: #fff; width: 100%; color: #333;";
      } else {
        backgroundStyle = "background-color: #eee; width: 100%; color: #555";
      }

      if (moment().dayOfYear() === dayObj.dayOfYear) {
        backgroundStyle = "border: 1px solid #999; width: 100%";
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
          let text, filler, length, marginLeft, marginRight;
          if (this.isVisible.includes(x.color)) {
            if (x.isStart) {
              text = stringTruncate(x.description, this.truncateAfter);
              marginLeft = "15px";
            } else {
              length = x.description.length;
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
              }; color: #fff; margin-bottom: 2px; margin-left: ${marginLeft};margin-right: ${marginRight};" >${text}</div>`;
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
      } else {
        this.isVisible.push(color);
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

<style>
header {
  display: flex;
  align-items: center;
  font-size: calc(16px + (26 - 16) * ((100vw - 300px) / (1600 - 300)));
  justify-content: center;
  margin-bottom: 2em;
  background: #000;
  color: #fff;
  min-height: 10vh;
  text-align: center;
}

ul {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* grid-gap: 0.1em; */
  margin: 0 auto;
  max-width: 99%;
  padding: 0;
}

li {
  display: flex;
  align-items: left;
  justify-content: left;
  list-style: none;
  margin-left: 0;
  padding: 0px;
  font-size: calc(16px + (21 - 16) * ((100vw - 300px) / (1600 - 300)));
}

ul.weekdays {
  margin-bottom: 1em;
}

ul.weekdays li {
  height: 4vw;
}

ul.day-grid li {
  background-color: #fff;
  border: 1px solid #eaeaea;
  height: 12vw;
  max-height: 200px;
}

ul.weekdays abbr[title] {
  border: none;
  font-weight: 800;
  text-decoration: none;
}

/* ul.day-grid li:nth-child(1),
ul.day-grid li:nth-child(2),
ul.day-grid li:nth-child(3),
ul.day-grid li:nth-child(34),
ul.day-grid li:nth-child(35) {
  background-color: #fff;
} */

@media all and (max-width: 800px) {
  ul {
    grid-gap: 0.25em;
  }

  ul.weekdays li {
    font-size: 0;
  }

  ul.weekdays > li abbr:after {
    content: attr(title);
    font-size: calc(16px + (26 - 16) * ((100vw - 300px) / (1600 - 300)));
    text-align: center;
  }
}
</style>