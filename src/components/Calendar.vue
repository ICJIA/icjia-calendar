<template>
  <div>
    <v-layout row wrap class="mb-5">
      <v-flex xs12>
        <header class="pl-3">
          <v-btn fab dark small color="grey" @click="getPreviousMonth()">
            <v-icon dark>arrow_back_ios</v-icon>
          </v-btn>
          <v-btn fab dark small color="grey" @click="getNextMonth()">
            <v-icon dark>arrow_forward_ios</v-icon>
          </v-btn>&nbsp;&nbsp;
          <h1 style="font-weight: 900">{{currentDate}}</h1>&nbsp;
        </header>
      </v-flex>

      <v-flex xs12>
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
              <!-- <li v-html="createDay(i)" @click="sheet = true"></li> -->
              <day-maker :gridID="i"/>
            </div>
          </ul>
        </div>
      </v-flex>
      <!-- <v-flex xs12 sm2 class="pl-5 mt-5">
        <div v-for="color in this.$store.state.appColors" :key="color">
          <v-switch :label="`${color}`" @click.native="toggleEvents(color)" input-value="true"></v-switch>
        </div>
      </v-flex>-->
    </v-layout>
    <div v-if="this.$store.state.debug">
      <v-layout row wrap class="pl-5 pr-5">
        <v-flex xs12>
          <div>
            <h2
              style="border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 15px;"
            >Debug:</h2>

            <h4>visibleEvents:</h4>
            <div>{{this.$store.state.visibleEvents}}</div>
            <h4>calendarMeta:</h4>
            <div>{{this.calendarMeta}}</div>
            <h4>api:</h4>
            <div>{{$store.getters.apiData}}</div>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
const moment = require("moment");

import _ from "lodash";
import DayMaker from "@/components/DayMaker";
import config from "@/config";
export default {
  components: {
    DayMaker
  },
  data() {
    return {
      truncateAfter: 15,
      sheet: false
    };
  },
  created() {
    console.log("Config:", config);
  },
  mounted() {},
  methods: {
    getNextMonth() {
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
    getPreviousMonth() {
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
  justify-content: left;
  margin-bottom: 2em;
  background: #000;
  color: #fff;
  min-height: 10vh;
  text-align: left;
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