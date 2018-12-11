<template>
  <div>
    <v-toolbar light color="blue-grey lighten-5" class="mt-2">
      <v-btn fab dark small color="grey accent-4" @click="getPreviousMonth()">
        <v-icon dark>remove</v-icon>
      </v-btn>
      <v-btn dark @click="today" color="grey accent-3" style="font-size: 12px;">TODAY</v-btn>
      <v-btn fab dark small color="grey accent-4" @click="getNextMonth()">
        <v-icon dark>add</v-icon>
      </v-btn>&nbsp;&nbsp;
      <v-toolbar-title
        class="black--text"
        style="font-size: 24px; text-transform: uppercase;"
      >{{currentDate}}</v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- <v-btn dark @click="today" color="grey accent-3">
        <v-icon dark left>today</v-icon>TODAY
      </v-btn>&nbsp;-->
      <v-btn
        dark
        color="grey accent-3"
        href="https://calendar.icjia-api.cloud/admin"
        target="_blank"
        style="color: #fff !important"
      >
        <v-icon dark left>add_box</v-icon>Add New Event
      </v-btn>
      <v-btn dark color="grey accent-3" @click="refresh">
        <v-icon>refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="name-container">
      <div class="name-element">Sunday</div>
      <div class="name-element">Monday</div>
      <div class="name-element">Tuesday</div>
      <div class="name-element">Wednesday</div>
      <div class="name-element">Thursday</div>
      <div class="name-element">Friday</div>
      <div class="name-element">Saturday</div>
    </div>

    <div class="wrapper with-height">
      <div v-for="i in gridSize" :key="`1${i}`">
        <div class="box box1" @click="getDayInfo(i)" :class="gridBackground(i)">
          <day-maker :gridID="i" :dayObj="generateDayMeta(i)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DayMaker from "@/components/DayMaker";
import moment from "moment";
import { getDayMeta } from "@/utils";
import _ from "lodash";
export default {
  components: {
    DayMaker
  },
  methods: {
    gridBackground(gridID) {
      const dayObj = getDayMeta(gridID, this.$store);
      if (dayObj.month - 1 === this.$store.state.currentMonth - 1) {
        return "white";
      } else {
        return "grey lighten-4";
      }
    },
    refresh() {
      window.location = "/";
    },
    generateDayMeta(gridID) {
      return getDayMeta(gridID, this.$store);
    },
    getDayInfo(gridID) {
      let meta = getDayMeta(gridID, this.$store);
      this.$store.dispatch("setDayMeta", meta);
      this.$store.dispatch("setCurrentDay", meta.day);
      this.$store.dispatch("setCurrentMonth", meta.month);
      this.$store.dispatch("setCurrentYear", meta.year);
      let noEvents = [];

      if (
        _.has(this.apiData, this.currentYear) &&
        _.has(this.apiData[this.currentYear], meta.dayOfYear)
      ) {
        this.$store.dispatch(
          "setDayEvents",
          this.apiData[meta.year][meta.dayOfYear]
        );
      } else {
        this.$store.dispatch("setDayEvents", noEvents);
      }
      this.$store.commit("OPEN_EVENT_DRAWER");
    },
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
    today() {
      this.$store.dispatch("setCurrentMonth", new Date().getMonth() + 1);
      this.$store.dispatch("setCurrentYear", new Date().getFullYear());
      this.$store.dispatch("setCurrentDay", new Date().getUTCDate());
      this.now = moment().format("MMMM DD, YYYY");
      let gridID =
        this.calendarMeta[this.currentYear][this.currentMonth - 1]
          .startDayOfWeek + this.currentDay;

      let meta = getDayMeta(gridID, this.$store);
      this.$store.dispatch("setDayMeta", meta);

      let noEvents = [];
      if (this.apiData[meta.year][meta.dayOfYear]) {
        this.$store.dispatch(
          "setDayEvents",
          this.apiData[meta.year][meta.dayOfYear]
        );
        this.$store.commit("OPEN_EVENT_DRAWER");
      } else {
        this.$store.dispatch("setDayEvents", noEvents);
        this.$store.commit("OPEN_EVENT_DRAWER");
      }
    }
  },
  computed: {
    currentDate() {
      let date = new Date(this.currentYear, this.currentMonth - 1);
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
    currentDay() {
      return this.$store.getters.currentDay;
    },
    currentMonth() {
      return this.$store.getters.currentMonth;
    },
    calendarMeta() {
      return this.$store.getters.calendarMeta;
    },
    eventData() {
      return this.$store.getters.data;
    },
    apiData() {
      return this.$store.getters.apiData;
    },
    isLoading() {
      return this.$store.getters.isLoading;
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  display: grid;
  grid-gap: 2px;
  grid-template-columns: repeat(7, minmax(50px, 1fr));
}
.box {
  background-color: #eee;
  color: #333;
  height: 100% !important;
  padding-bottom: 20px;
}

.box:hover {
  background-color: #ddd !important;
  cursor: pointer;
}

.name-container {
  display: grid;
  grid-gap: 2px;
  grid-template-columns: repeat(7, minmax(50px, 1fr));
  grid-auto-rows: minmax(10px, auto) !important;
  margin-top: 2px;
}
.name-element {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  color: #222;
  font-weight: bold;
  min-height: 10px;
  background-color: #bbb;
}
</style>