<template>
  <div>
    <!-- <div id="eventList">
      <div>{{this.$store.state.currentDate}}</div>
      <div v-if="events === undefined">NO EVENTS</div>
      <div v-else v-for="(event, index) in events" :key="index">
        <span>{{event}}</span>
      </div>
    </div>-->
    <div class="text-xs-center">
      <h1>{{formatFriendlyDate(this.$store.state.currentDate)}}</h1>
    </div>
    <div v-if="!debug">
      <div v-if="events.length===0" class="text-xs-center mt-3">
        <h3 style="color: #777">NO EVENTS SCHEDULED</h3>
      </div>
      <div v-else class="pl-3 pr-3 mt-4 pr-3" ref="eventList">
        <div v-for="(event, index) in events" :key="index">
          <v-layout>
            <v-flex xs12>
              <v-card class="mt-3">
                <div
                  class="text-xs-right pr-3 pt-2 pb-2"
                  :style="getCategoryBackgroundColor(event.color)"
                >{{event.category}}</div>
                <div class="pl-3 pr-1 headerBox">
                  <span class="pt-2 pb-2 eventTitle" style>{{event.title}}</span>
                </div>
                <div class="pt-2 pl-3 pr-2 pb-4">
                  <span>
                    <span v-html="getEventRange(event)" class="eventRange"></span>
                  </span>
                  <span style="float: right">
                    <span class="duration">{{getDuration(event.duration)}}</span>
                  </span>

                  <div v-html="markdownToHtml(event.description)" class="description mt-5"></div>
                </div>

                <div
                  class="text-xs-right pt-2 pb-2 pl-2 pr-2"
                  style="font-size: 10px; text-transform: uppercase;  font-weight: bold; color: #999; background: #fff; border-top: 1px solid #eee;"
                >
                  <span>
                    <span>Posted:</span>
                    {{formatDate(event.createdAt)}}
                  </span>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
    <div v-else>{{events}}</div>
  </div>
</template>

<script>
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);
// import { EventBus } from "../event-bus.js";
import _ from "lodash";
export default {
  methods: {
    getCategoryBackgroundColor(color) {
      return `padding: 0; margin: 0; font-size: 10px; background-color: ${color} !important; color: #eee !important; font-weight: bold; text-transform: uppercase;`;
    },
    getEventRange({ start, end, duration }) {
      if (duration === 0) {
        return moment.utc(start).format("MMM DD, YYYY");
      }
      return `${moment.utc(start).format("MMM DD, YYYY")} - ${moment
        .utc(end)
        .format("MMM DD, YYYY")}`;
    },
    getDuration(num) {
      if (num < 1) {
        return `1 day`;
      }
      return `${num} days`;
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
    formatDate(d) {
      return moment(d)
        .utc()
        .format("MM/DD/YYYY");
    },
    formatFriendlyDate(d) {
      return moment(d)
        .utc()
        .format("dddd, MMMM DD, YYYY");
    }
  },
  computed: {
    dayOfYear() {
      let dayOfYear = moment(this.$store.state.currentDate)
        .utc()
        .dayOfYear();
      return dayOfYear;
    },
    debug() {
      return this.$store.getters.debug;
    },
    year() {
      let year = moment(this.$store.state.currentDate)
        .utc()
        .format("YYYY");
      return year;
    },
    events() {
      let events;

      try {
        events = this.$store.state.events[this.year][this.dayOfYear];
      } catch (e) {
        events = undefined;
      }
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
    }
  }
};
</script>

<style scoped>
.eventTitle {
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
  font-size: 18px;
}

.duration {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  color: #666;
}
.eventRange {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  color: #222;
}
.headerBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
