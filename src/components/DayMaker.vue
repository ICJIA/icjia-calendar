<template>
  <div>
    <div v-if="dayObj.year >=this.minYear && dayObj.year <= this.maxYear">
      <li @click="getDayInfo(gridID)" class="grid">
        <span style="width: 100% !important;" :class="gridBackground()">
          <div>{{dayObj.day}}</div>
          <div v-for="(event, index) in dayObj.dayEvents" :key="index">
            <div v-for="(isVisible, index) in visibleEvents" :key="index">
              <div v-if="event.color === isVisible">
                <v-tooltip top open-delay="50" max-width="400">
                  <div :style="eventStyle(event)" class="event" slot="activator">{{event.title}}</div>
                  <h2 style="text-transform: uppercase;">{{event.title}}</h2>
                  <div v-html="event.excerpt"></div>
                </v-tooltip>
              </div>
            </div>
          </div>
          <div v-if="debug" style="font-size: 10px;">
            Day: {{dayObj.gridID}}
            <br>
            Day of Year: {{dayObj.dayOfYear}}
            <br>
            Full date: {{fullDateFromDayOfYear(dayObj.dayOfYear).format('YYYY-MM-DD')}}
          </div>
        </span>
      </li>
    </div>
    <div v-else>
      <li>
        <span style="width: 100% !important; background-color: #888"></span>
      </li>
    </div>
  </div>
</template>

<script>
import { getDayMeta } from "@/utils";
import _ from "lodash";
import moment from "moment";

export default {
  props: {
    gridID: {
      type: Number
    },
    dayObj: {
      type: Object
    }
  },

  data() {
    return {
      truncateAfter: 15,
      sheet: false,
      dayMeta: null,
      backgroundStyle: null,
      dayEvents: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    gridBackground() {
      if (this.dayObj.month - 1 === this.$store.state.currentMonth - 1) {
        return "white";
      } else {
        return "grey lighten-3";
      }
    },
    fullDateFromDayOfYear(day) {
      return moment().dayOfYear(day);
    },

    eventStyle(event) {
      let marginLeft = "0px";
      let marginRight = "0px";

      return `background-color: ${
        event.color
      }; font-size: 11px; text-transform: uppercase; color: #fff; padding: 4px 4px; font-weight: bold; margin-bottom: 5px; margin-left: ${marginLeft}; margin-right: ${marginRight}`;
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
    debug() {
      return this.$store.getters.debug;
    },
    visibleEvents() {
      return this.$store.getters.visibleEvents;
    },

    isWithinMinMax() {
      if (this.currentYear >= this.minYear) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
.grid:hover {
  cursor: pointer;
}
.event:hover {
  background-color: #bbb !important;
  color: #222 !important;
}
</style>