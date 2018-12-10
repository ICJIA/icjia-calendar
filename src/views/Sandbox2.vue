<template>
  <v-container>
    <h2 class="rule">EVENTS:</h2>
    <tree-view :data="events" :options="{maxDepth: 4}"></tree-view>
  </v-container>
</template>

<script>
import moment from "moment";
import api from "@/api/events.json";
import _ from "lodash";
export default {
  created() {
    this.events = this.init(api);
  },
  methods: {
    init(api) {
      let events = {};
      api.forEach(e => {
        let eventObj = {};
        let start, end, duration;
        start = moment(e.start);
        end = moment(e.end);

        duration = end.diff(start, "days");
        eventObj.title = e.title.trim();
        eventObj.start = e.start;
        eventObj.end = e.end;
        eventObj.duration = duration;
        eventObj.description = e.description;
        eventObj.color = "firebrick";
        eventObj.category = e.category.trim();
        if (duration === 0) {
          eventObj.duration = 1;
          let dayOfYear = start.dayOfYear();
          if (!_.has(events, start.format("YYYY"))) {
            events[start.format("YYYY")] = {};
          }
          if (!_.has(events[start.format("YYYY")], dayOfYear)) {
            events[start.format("YYYY")][dayOfYear] = [];
          }
          events[start.format("YYYY")][dayOfYear].push(eventObj);
        } else {
          for (let d = 0; d <= duration; d++) {
            let workingDate = start.add(1, "days");
            let dayOfYear = moment(workingDate).dayOfYear();

            eventObj.duration = duration + 1;
            eventObj.year = moment(workingDate).format("YYYY");
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
      return events;
    }
  },
  data() {
    return {
      api: api,
      events: null
    };
  }
};
</script>

<style scoped>
.rule {
  border-bottom: 1px solid #aaa;
  padding-bottom: 10px;
  margin-bottom: 12px;
}
</style>