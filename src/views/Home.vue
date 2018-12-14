<template>
  <div>
    <calendar/>
  </div>
</template>

<script>
import Calendar from "../components/Calendar";

import { stringTruncate, getDayMeta } from "@/utils";
import moment from "moment";
import _ from "lodash";
import config from "@/config";

export default {
  components: {
    Calendar
  },
  created() {
    this.$store.dispatch("setCurrentYear", parseInt(new Date().getFullYear()));
    this.$store.dispatch(
      "setCurrentMonth",
      parseInt(new Date().getMonth()) + 1
    );
    this.$store.dispatch("setCurrentDay", parseInt(new Date().getUTCDate()));

    this.getEvents();
  },
  data() {
    return {
      events: {}
    };
  },
  methods: {
    async getEvents() {
      this.$store.dispatch("startLoader");

      try {
        let response = await this.$http.get(
          `${config.api.base}${config.api.events}`
        );
        this.createEvents(response);
        this.$store.dispatch("setApiData", this.events);
        this.setToday();
        this.$store.dispatch("stopLoader");
      } catch (e) {
        this.$store.dispatch("stopLoader");
        let error = JSON.stringify(e);
        console.log(error);
        this.$store.commit(
          "api_error",
          "NETWORK ERROR. PLEASE LOG OUT AND TRY AGAIN OR REFRESH."
        );
      }
    },
    createEvents(response) {
      let events = {};
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
        eventObj.year = moment.utc(e.start).year();

        if (!_.has(events, start.format("YYYY"))) {
          events[eventObj.year] = {};
        }
        if (!_.has(events[start.format("YYYY")], dayOfYear)) {
          events[start.format("YYYY")][dayOfYear] = [];
        }
        events[start.format("YYYY")][dayOfYear].push(eventObj);
        if (duration > 0) {
          for (let d = 0; d < duration; d++) {
            let workingDate = start.add(1, "days");
            let dayOfYear = moment.utc(workingDate).dayOfYear();

            eventObj.duration = duration + 1;
            eventObj.year = moment.utc(workingDate).format("YYYY");
            if (!_.has(events, eventObj.year)) {
              events[eventObj.year] = {};
            }
            if (!_.has(events[eventObj.year], dayOfYear)) {
              events[eventObj.year][dayOfYear] = [];
            }
            events[eventObj.year][dayOfYear].push(eventObj);
          }
        }
      });
      this.events = events;
    },
    setToday() {
      // auto-populate eventDrawer with today's info
      let gridID =
        this.calendarMeta[this.currentYear][this.currentMonth - 1]
          .startDayOfWeek + this.currentDay;
      let meta = getDayMeta(gridID, this.$store);
      this.$store.dispatch("setDayMeta", meta);
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
<style scoped>
</style>
