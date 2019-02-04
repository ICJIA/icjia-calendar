<template>
  <div style="margin-top: 10px">
    <v-container class="pb-5">
      <v-flex xs12 sm12 md10 offset-md1>
        <h1 class="mt-5">Filter Events By Category</h1>
        <v-select
          :items="categories"
          solo
          item-text="name"
          item-value="name"
          v-model="defaultSelected"
          v-on:change="selectEvent"
          class="mt-3"
        ></v-select>
        <div
          class="text-xs-right"
          style="font-size: 12px; font-weight: bold; margin-top: -10px; color: #555"
        >Displaying: {{filteredEvents.length}} of {{allEvents.length}}</div>
        <div
          v-for="(event, index) in filteredEvents"
          :key="index"
          class="mt-5 animated fadeIn fast"
        >
          <v-layout>
            <v-flex xs12 sm12 md10 offset-md1>
              <v-hover>
                <v-card
                  class="mt-3 eventCard"
                  @click.native="showOnCalendar(event.start)"
                  slot-scope="{ hover }"
                  :class="`elevation-${hover ? 16 : 2}`"
                >
                  <div
                    class="text-xs-right pr-3 pt-2 pb-2"
                    :style="getBackgroundColor(event)"
                  >{{event.category}}</div>
                  <div :style="getBackgroundColor(event)" class="pt-2 pb-2 pl-3 pr-1 headerBox">
                    <span
                      style="text-transform: uppercase; color: #fff; font-size: 18px;"
                      id="title"
                    >{{event.title}}</span>
                  </div>
                  <div class="pt-2 pl-3 pr-2 pb-4">
                    <span>
                      <span v-html="getEventRange(event.start, event.end)" class="eventRange"></span>
                    </span>
                    <span style="float: right">
                      <span class="duration">{{getDuration(event.start, event.end)}}</span>
                    </span>

                    <div v-html="markdownToHtml(event.description)" class="description mt-3"></div>
                  </div>

                  <div
                    class="pt-2 pb-2 pl-2 pr-2"
                    style="font-size: 10px; text-transform: uppercase;  font-weight: bold; color: #999; background: #fff; border-top: 1px solid #eee;"
                  >
                    <span style="color: #333" @click="view()">View on Calendar</span>
                    
                    <span style="float: right">Posted: {{formatDate(event.createdAt)}}</span>
                  </div>
                </v-card>
              </v-hover>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);
import { EventBus } from "@/event-bus.js";
import _ from "lodash";

export default {
  mounted() {
    this.categories = config.app.categories.map(c => {
      let obj = {};
      obj.name = c.name;
      obj.slug = c.slug;
      return obj;
    });

    this.categories.unshift({ name: "All Categories" });
    this.sortEvents();
    this.filteredEvents = this.allEvents;
    EventBus.$on("refresh", () => {
      this.allEvents = this.$store.state.data.data;
      this.sortEvents();
    });
  },
  data() {
    return {
      allEvents: this.$store.state.data.data,
      filteredEvents: [],
      categories: [],
      defaultSelected: { name: "All Categories" }
    };
  },
  methods: {
    sortEvents() {
      this.allEvents = _.orderBy(
        this.allEvents,
        [
          function(item) {
            return item.start;
          },
          function(item) {
            return item.category;
          },
          function(item) {
            return item.title;
          }
        ],
        ["asc", "asc", "asc"]
      );
    },
    selectEvent(evt) {
      if (evt === "All Categories") {
        this.filteredEvents = this.allEvents;
      } else {
        let filtered = this.allEvents.filter(e => {
          if (e.category === evt) return e;
        });
        this.filteredEvents = filtered;
      }
    },
    showOnCalendar(date) {
      this.$store.commit("OPEN_EVENT_DRAWER");
      this.$store.dispatch(
        "setCurrentDate",
        moment(date)
          .utc()
          .format()
      );
      this.$store.dispatch(
        "setSelectedDate",
        moment(date)
          .utc()
          .format()
      );
    },

    getBackgroundColor(e) {
      let color;
      let colorIndex = _.findIndex(config.app.categories, {
        name: e.category.trim()
      });
      try {
        color = config.app.categories[colorIndex].color;
      } catch {
        color = "gray";
      }
      return `border-top: 1px solid #aaa; background-color: ${color} !important; color: #eee !important; font-weight: bold; text-transform: uppercase;`;
    },
    formatDate(d) {
      return moment(d).format("MM/DD/YYYY");
    },

    getDuration(start, end) {
      var s = moment(start);
      var e = moment(end);

      let duration;
      if (s > e) {
        duration = s.diff(e, "days") + 1;
      } else {
        duration = e.diff(s, "days") + 1;
      }

      if (duration === 1) {
        return duration + " day";
      } else {
        return duration + " days";
      }
    },
    getEventRange(start, end) {
      var s = moment(start);
      var e = moment(end);

      let duration = s.diff(e, "days") + 1;
      if (duration === 1) {
        return moment(s)
          .utc()
          .format("dddd, MMMM DD, YYYY");
      } else {
        return (
          moment(s)
            .utc()
            .format("dddd, MMMM DD, YYYY") +
          " - " +
          moment(e)
            .utc()
            .format("dddd, MMMM DD, YYYY")
        );
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
    view() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.eventCard:hover {
  cursor: pointer;
}
</style>
