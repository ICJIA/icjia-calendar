<template>
  <div>
    <div
      class="box box1"
      @click="selectDay"
      v-if="this.$store.state.initialized"
      :class="gridBackgroundStyle(gridID)"
    >
      <div v-if="isCondensed" class="pb-2 dayName pl-2">{{displayFriendlyDate}}</div>
      <div v-if="!isCondensed" class="pb-2 dayName pl-2">{{day}}</div>
      <div v-for="(event, index) in events" :key="index">
        <div v-for="(isVisible, index) in visibleEvents" :key="index">
          <div v-if="event.color === isVisible">
            <v-tooltip top open-delay="50" max-width="400" :disabled="isCondensed">
              <div class="event" :style="eventStyle(event)" slot="activator">
                <span v-if="!$store.getters.condensedCalendarView">{{event.title}}</span>
              </div>
              <h2 style="text-transform: uppercase;">{{event.title}}</h2>
              <div v-html="markdownToHtml(event.excerpt)"></div>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);
import { EventBus } from "../event-bus.js";
import _ from "lodash";
export default {
  props: {
    gridID: {
      type: Number
    },

    calendarMeta: {
      type: Object
    }
  },
  methods: {
    gridBackgroundStyle(gridID) {
      let startGridNumber = this.calendarMeta.startDayOfWeek;
      let endGridNumber =
        startGridNumber + moment(this.$store.state.selectedDate).daysInMonth();

      if (
        moment(this.fullDate)
          .startOf("day")
          .format("MM-DD-YYYY") ===
        moment(this.today)
          .startOf("day")
          .format("MM-DD-YYYY")
      ) {
        return "indigo lighten-3";
      }

      if (gridID < startGridNumber || gridID >= endGridNumber) {
        return "grey lighten-3";
      } else {
        return "white";
      }
    },
    markdownToHtml(description) {
      const html = md.render(description);
      /** HTML links to open in new tab */
      const pattern = /a href=/g;
      const sanitizedMarkDownText = html.replace(
        pattern,
        "a target='_blank' href="
      );
      return sanitizedMarkDownText;
    },

    eventStyle(event) {
      let marginLeft = "0px";
      let marginRight = "0px";
      return `background-color: ${
        event.color
      }; font-size: 11px; min-height: 5px !important; text-transform: uppercase; color: #fff; padding: 4px 4px; font-weight: bold; margin-bottom: 3px; margin-left: ${marginLeft}; margin-right: ${marginRight}`;
    },
    selectDay() {
      this.$store.commit("OPEN_EVENT_DRAWER");
      this.$store.commit("SET_TRANSITION_TOGGLE");
      this.$store.dispatch(
        "setCurrentDate",
        moment(this.fullDate)
          .startOf("day")
          .format()
      );
    }
  },
  computed: {
    fullDate() {
      let fullDate = moment(this.calendarMeta.gridFirst)
        .startOf("day")
        .add(this.gridID, "day");
      return fullDate;
    },
    displayFriendlyDate() {
      return moment(this.fullDate)
        .dayOfYear(this.dayOfYear)
        .format("dddd, MMMM Do, YYYY");
    },

    day() {
      let day = moment(this.calendarMeta.gridFirst)
        .startOf("day")
        .add(this.gridID, "day")
        .format("DD");
      return day;
    },
    today() {
      return moment()
        .startOf("day")
        .format();
    },
    dayOfYear() {
      let dayOfYear = moment(this.fullDate)
        .startOf("day")
        .dayOfYear();
      return dayOfYear;
    },
    year() {
      let year = moment(this.fullDate)
        .startOf("day")
        .format("YYYY");
      return year;
    },
    events() {
      let events;
      try {
        events = this.$store.state.events[this.year][this.dayOfYear];
      } catch (e) {
        events = null;
      }
      /**
       * sort by event title
       */
      // events = _.orderBy(events, "title", "asc");

      events = _.orderBy(
        events,
        [
          function(item) {
            return item.category;
          },
          function(item) {
            return item.title;
          }
        ],
        ["asc", "asc"]
      );
      return events;
    },
    visibleEvents() {
      return this.$store.getters.visibleEvents;
    },
    breakpoint() {
      return this.$vuetify.breakpoint;
    },
    isCondensed() {
      if (this.breakpoint.name === "xs" || this.breakpoint.name === "sm") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.box {
  color: #333;
  height: 100% !important;
  padding-bottom: 20px;
  min-height: 180px;
}
.box:hover {
  background-color: #ddd !important;
  cursor: pointer;
}

.dayName {
  font-weight: bold;
}

@media only screen and (max-width: 960px) {
  .box {
    min-height: 10px;
  }
}
</style>
