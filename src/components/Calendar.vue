<template>
  <div>
    <v-bottom-sheet v-model="sheet">
      <v-layout>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Lorem ipsum dolor sit amet</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et purus nec nunc vestibulum mattis nec quis quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam a sodales lacus, ac imperdiet orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sit amet lacus et elit pellentesque dignissim. Curabitur nec imperdiet dui, vel venenatis libero. Duis posuere diam in magna convallis, sit amet dictum nulla posuere. Nulla ut aliquet erat. Quisque eget convallis ex, et egestas augue. Donec sit amet velit sodales, tincidunt metus ac, posuere nulla. Quisque eu dolor sit amet ex viverra sagittis. Phasellus eget dolor enim. Duis ante ante, elementum nec sagittis quis, malesuada eget velit.
                Mauris sit amet vulputate sapien. Sed laoreet luctus dignissim. Sed sollicitudin, ligula et elementum accumsan, arcu felis placerat tellus, ac dapibus orci sapien porttitor lacus. Nulla fermentum tincidunt porta. Pellentesque tincidunt dui sit amet risus sollicitudin interdum in nec nisl. Donec aliquam nisi quis orci tincidunt viverra. Proin non maximus diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vitae pharetra massa. Mauris ac venenatis dui. Proin tellus tellus, lobortis vel eros a, semper interdum mauris. Aliquam erat volutpat. Donec eu lectus quis ligula scelerisque vehicula quis ultricies nunc. Vestibulum mi elit, faucibus non leo sed, volutpat iaculis tortor. Suspendisse pretium lacinia egestas.
              </p>
              <h2>Lorem ipsum dolor sit amet</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et purus nec nunc vestibulum mattis nec quis quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam a sodales lacus, ac imperdiet orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sit amet lacus et elit pellentesque dignissim. Curabitur nec imperdiet dui, vel venenatis libero. Duis posuere diam in magna convallis, sit amet dictum nulla posuere. Nulla ut aliquet erat. Quisque eget convallis ex, et egestas augue. Donec sit amet velit sodales, tincidunt metus ac, posuere nulla. Quisque eu dolor sit amet ex viverra sagittis. Phasellus eget dolor enim. Duis ante ante, elementum nec sagittis quis, malesuada eget velit.
                Mauris sit amet vulputate sapien. Sed laoreet luctus dignissim. Sed sollicitudin, ligula et elementum accumsan, arcu felis placerat tellus, ac dapibus orci sapien porttitor lacus. Nulla fermentum tincidunt porta. Pellentesque tincidunt dui sit amet risus sollicitudin interdum in nec nisl. Donec aliquam nisi quis orci tincidunt viverra. Proin non maximus diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vitae pharetra massa. Mauris ac venenatis dui. Proin tellus tellus, lobortis vel eros a, semper interdum mauris. Aliquam erat volutpat. Donec eu lectus quis ligula scelerisque vehicula quis ultricies nunc. Vestibulum mi elit, faucibus non leo sed, volutpat iaculis tortor. Suspendisse pretium lacinia egestas.
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn flat color="orange" @click="sheet=false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-bottom-sheet>
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

      <v-flex xs12 sm10>
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
              <li v-html="getDayMeta(i)" @click="sheet = true"></li>
              <!-- <day-maker :gridID="i"/> -->
            </div>
          </ul>
        </div>
      </v-flex>
      <v-flex xs12 sm2 class="pl-5 mt-5">
        <div v-for="color in this.$store.state.appColors" :key="color">
          <v-switch :label="`${color}`" @click.native="toggleEvents(color)" input-value="true"></v-switch>
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
            <h4>visibleEvents:</h4>
            <div>{{this.$store.state.visibleEvents}}</div>
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
import { createEventHTML } from "@/utils";
import _ from "lodash";
// const eventData = require("@/api/index.json");

// const data = require("@/api/index.json");
export default {
  components: {},
  data() {
    return {
      truncateAfter: 15,
      sheet: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    getDayMeta(gridID) {
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

      let html = createEventHTML(dayObj, this.$store);

      return html;
    },
    nextMonth() {
      if (this.currentMonth === 12 && this.currentYear === this.maxYear) {
        this.$store.dispatch("setCurrentMonth", 12);
        this.$store.dispatch("setCurrentYear", this.$store.state.maxYear);
      } else if (this.currentMonth === 12) {
        this.$store.dispatch("setCurrentMonth", 1);
        this.$store.dispatch(
          "setCurrentYear",
          this.$store.state.currentYear + 1
        );
      } else {
        this.$store.dispatch(
          "setCurrentMonth",
          this.$store.state.currentMonth + 1
        );
      }
    },
    lastMonth() {
      if (this.currentMonth === 1 && this.currentYear === this.minYear) {
        this.$store.dispatch("setCurrentMonth", 1);
        this.$store.dispatch("setCurrentYear", this.$store.state.minYear);
      } else if (this.currentMonth === 1) {
        this.$store.dispatch("setCurrentMonth", 12);
        this.$store.dispatch(
          "setCurrentYear",
          this.$store.state.currentYear - 1
        );
      } else {
        this.$store.dispatch(
          "setCurrentMonth",
          this.$store.state.currentMonth - 1
        );
      }
    },
    toggleEvents(color) {
      let isVisible = [];
      if (this.$store.getters.visibleEvents.includes(color)) {
        isVisible = _.remove(this.$store.getters.visibleEvents, function(n) {
          return n !== color;
        });

        this.$store.dispatch("setVisibleEvents", isVisible);
      } else {
        isVisible = this.$store.getters.visibleEvents;
        isVisible.push(color);

        this.$store.dispatch("setVisibleEvents", isVisible);
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
    },
    minYear() {
      return this.$store.getters.minYear;
    },
    maxYear() {
      return this.$store.getters.maxYear;
    },
    currentYear() {
      return this.$store.getters.currentYear;
    },
    currentMonth() {
      return this.$store.getters.currentMonth;
    },
    calendarMeta() {
      return this.$store.getters.calendarMeta;
    },
    eventData() {
      return this.$store.getters.data;
    }
  }
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
  /* background-color: #fff;
  border: 1px solid #eaeaea; */
  height: 12vw;
  max-height: 200px;
  padding: 1px;
}

ul.day-grid li:hover {
  border: 1px solid #777;
}

ul.weekdays abbr[title] {
  border: none;
  font-weight: 800;
  text-decoration: none;
}

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