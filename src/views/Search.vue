<template>
  <div>
    <v-form class="pb-5">
      <v-container>
        <v-flex xs12 sm12 md10 offset-md1>
          <h1 class="mt-5">Event Search</h1>
          <v-text-field
            v-model="query"
            @keyup="instantSearch"
            label="Search"
            placeholder="Enter any word from the event's category, title, or description"
          ></v-text-field>
          <div
            class="text-xs-right"
            style="font-size: 12px; font-weight: bold; margin-top: -10px; color: #555"
          >Found: {{result.length}}</div>
        </v-flex>
        <div v-for="(event, index) in result" :key="index" class="mt-5">
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
                  <div :style="getBackgroundColor(event)" class="pl-3 pr-1 headerBox">
                    <span
                      class="pt-2 pb-2"
                      style="text-transform: uppercase; color: #fff;"
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
                    class="text-xs-right pt-2 pb-2 pl-2 pr-2"
                    style="font-size: 10px; text-transform: uppercase;  font-weight: bold; color: #999; background: #fff; border-top: 1px solid #eee;"
                  >
                    <span>Posted: {{formatDate(event.createdAt)}}</span>
                  </div>
                </v-card>
              </v-hover>
            </v-flex>
          </v-layout>
        </div>
      </v-container>
      <!-- {{events}} -->
    </v-form>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);
import { getDayMeta } from "@/utils";

import _ from "lodash";
export default {
  mounted() {
    this.$store.commit("CLOSE_EVENT_DRAWER");
    this.$store.commit("CLOSE_CATEGORY_DRAWER");
  },
  created() {
    this.getEvents();
  },
  methods: {
    instantSearch() {
      this.result = this.fuse.search(this.query);
    },
    showOnCalendar(date) {
      let year, month, day, d;
      year = moment.utc(date).format("YYYY");
      month = moment.utc(date).format("MM");
      day = moment.utc(date).format("DD");
      d = moment.utc(date);

      this.$store.dispatch("setCurrentYear", parseInt(year));
      this.$store.dispatch("setCurrentMonth", parseInt(month));
      this.$store.dispatch("setCurrentDay", parseInt(day));
      this.$store.commit("CLOSE_EVENT_DRAWER");
      // let meta = this.$store.state.apiData[year][d.dayOfYear()];
      // console.log(meta);

      // this.$store.dispatch("setDayMeta", meta);
      // this.$store.dispatch("setDayEvents", meta);

      this.$router.push("/");
    },
    async getEvents() {
      try {
        let response = await this.$http.get(
          `${config.api.base}${config.api.events}`
        );

        this.events = response.data;
        this.fuse = new Fuse(this.events, config.app.search);
      } catch (e) {
        console.log(JSON.stringify(e));
      }
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
      return `margin: 0; padding: 0; border-top: 1px solid #aaa; background-color: ${color} !important; color: #eee !important; font-weight: bold; text-transform: uppercase;`;
    },
    formatDate(d) {
      return moment(d).format("MM/DD/YYYY");
    },

    getDuration(s, e) {
      let duration, start, end;
      start = moment.utc(s);
      end = moment.utc(e);

      if (!end.isValid()) {
        return `1 day`;
      }

      if (start > end) {
        duration = start.diff(end, "days");
      } else {
        duration = end.diff(start, "days");
      }
      return `${duration + 1} Days`;
    },
    getEventRange(s, e) {
      let start = moment.utc(s);
      let end = moment.utc(e);
      let str = `${start.format("dddd MMMM DD, YYYY")}`;
      if (end.isValid()) {
        str = str + ` - ${end.format("dddd MMMM DD, YYYY")}`;
      }
      return str;
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
    }
  },
  computed: {},
  data() {
    return {
      query: "",
      result: [],
      fuse: null,
      events: null
    };
  }
};
</script>

<style scoped>
.eventCard:hover {
  cursor: pointer;
}
</style>