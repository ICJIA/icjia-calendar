<template>
  <div>
    <tree-view :data="events" :options="{maxDepth: 3}"></tree-view>
  </div>
</template>

<script>
import { stringTruncate, getDayMeta } from "@/utils";
import moment from "moment";
import _ from "lodash";
import config from "@/config";

export default {
  data() {
    return {
      events: null
    };
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
  methods: {
    async getEvents() {
      try {
        let response = await this.$http.get(
          `${config.api.base}${config.api.events}`
        );
        this.createEvents(response);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    },
    createEvents(response) {
      let events = {};
      response.data.forEach(e => {
        (function() {
          let eventObj = {};
          let start, end, duration;

          if (!e.end) {
            e.end = e.start;
          }

          start = moment.utc(e.start);
          end = moment.utc(e.end);

          //TODO: Check start < end
          if (start > end) {
            duration = start.diff(end, "days");
          } else {
            duration = end.diff(start, "days");
          }

          eventObj.title = e.title.trim();
          eventObj.start = e.start;
          eventObj.end = e.end;
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
        })();
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
  }
};
</script>

<style scoped>
</style>