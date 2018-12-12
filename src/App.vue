<template>
  <v-app>
    <navbar/>

    <v-content>
      <div
        v-if="$browserDetect.isIE"
        class="text-xs-center pt-5 pb-5 mt-3 mb-3"
        style="background-color: red"
      >
        <h1 style="color: white">
          Your browser is out of date.
          <br>In order to view this calendar, please update to the latest
          <br>
          <a href="https://www.google.com/chrome/">Chrome</a>,
          <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>, or
          <a href="https://www.microsoft.com/en-us/windows/microsoft-edge">Microsoft Edge</a>.
        </h1>
        <h3 class="mt-4">Need help with the update?
          <router-link to="/contact">Contact ICJIA Tecnical Support</router-link>&nbsp;for assistance.
        </h3>
      </div>
      <div v-if="isLoading">
        <v-progress-linear :indeterminate="true" style="padding: 0; margin: 0" height="5"></v-progress-linear>
      </div>
      <div v-else style="height: 4px;"></div>
      <router-view/>
    </v-content>
    <my-footer/>
  </v-app>
</template>

<script>
import { createCalendarHelper } from "@/utils";

import Navbar from "@/components/Navbar";
import MyFooter from "@/components/MyFooter";
import { stringTruncate, getDayMeta } from "@/utils";
import moment from "moment";
import _ from "lodash";
import { config } from "@/config";
import { EventBus } from "@/event-bus.js";
export default {
  name: "App",
  components: {
    Navbar,
    MyFooter
  },
  data() {
    return {
      events: {}
    };
  },
  created() {
    this.$store.dispatch("startLoader");
    this.init();
    this.getEvents();
    EventBus.$on("refresh", () => {
      console.log("refresh here");
    });
  },
  methods: {
    init() {
      this.$store.dispatch(
        "setCurrentYear",
        parseInt(new Date().getFullYear())
      );
      this.$store.dispatch(
        "setCurrentMonth",
        parseInt(new Date().getMonth()) + 1
      );
      this.$store.dispatch("setCurrentDay", parseInt(new Date().getUTCDate()));
      this.$store.dispatch("setMinYear", config.app.minYear);
      this.$store.dispatch("setMaxYear", config.app.maxYear);
      this.$store.dispatch(
        "setCalendarMeta",
        createCalendarHelper(this.minYear, this.maxYear)
      );
    },
    getEvents() {
      this.$http
        .get(`${config.app.baseURL}${config.app.eventsRoute}`)
        .then(response => {
          this.createEvents(response);
          this.$store.dispatch("setApiData", this.events);
          this.$store.dispatch("stopLoader");
        })
        .catch(e => console.log(e));
    },
    createEvents(response) {
      response.data.forEach(e => {
        let eventObj = {};
        let start, end, duration;
        start = moment.utc(e.start);
        if (e.end) {
          end = moment.utc(e.end);
        } else {
          end = end = moment.utc(e.start);
        }

        duration = end.diff(start, "days");
        eventObj.title = e.title.trim();
        eventObj.start = e.start;
        eventObj.end = end;
        eventObj.duration = duration;
        eventObj.description = e.description;
        eventObj.excerpt = stringTruncate(e.description, 150);
        let colorIndex = _.findIndex(config.categories, {
          name: e.category.trim()
        });
        try {
          eventObj.color = config.categories[colorIndex].color;
        } catch {
          eventObj.color = "gray";
        }

        eventObj.category = e.category.trim();

        eventObj.duration;
        let dayOfYear = moment.utc(e.start).dayOfYear();
        eventObj.year = moment.utc(e.start).format("YYYY");
        if (!_.has(this.events, start.format("YYYY"))) {
          this.events[start.format("YYYY")] = {};
        }
        if (!_.has(this.events[start.format("YYYY")], dayOfYear)) {
          this.events[start.format("YYYY")][dayOfYear] = [];
        }
        this.events[start.format("YYYY")][dayOfYear].push(eventObj);
        if (duration > 0) {
          for (let d = 0; d < duration; d++) {
            let workingDate = start.add(1, "days");
            let dayOfYear = moment.utc(workingDate).dayOfYear();

            eventObj.duration = duration + 1;
            eventObj.year = moment.utc(workingDate).format("YYYY");
            if (!_.has(this.events, eventObj.year)) {
              this.events[eventObj.year] = {};
            }
            if (!_.has(this.events[eventObj.year], dayOfYear)) {
              this.events[eventObj.year][dayOfYear] = [];
            }
            this.events[eventObj.year][dayOfYear].push(eventObj);
          }
        }
      });
    },
    setToday() {
      // auto-populate eventDrawer with today's info
      let gridID =
        this.calendarMeta[this.currentYear][this.currentMonth - 1]
          .startDayOfWeek + this.currentDay;

      let meta = getDayMeta(gridID, this.$store);
      this.$store.dispatch("setDayMeta", meta);
      let noEvents = [];

      if (this.events[meta.year][meta.dayOfYear]) {
        this.$store.dispatch(
          "setDayEvents",
          this.apiData[meta.year][meta.dayOfYear]
        );
      } else {
        this.$store.dispatch("setDayEvents", noEvents);
      }
    }
  },
  computed: {
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
    currentDay() {
      return this.$store.getters.currentDay;
    },
    calendarMeta() {
      return this.$store.getters.calendarMeta;
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

<style>
a {
  color: #aaa !important;
}

.header-link {
  color: #222;
}

.subheader-link {
  color: #222;
}

a {
  color: #ddd !important;
}

.theme--light.application {
  background: #bbb !important;
}
</style>
