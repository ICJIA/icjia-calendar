<template>
  <div>
    <v-navigation-drawer
      :value="categoryDrawer"
      fixed
      clipped
      app
      disable-resize-watcher
      width="250"
    >
      <div class="text-xs-center pb-0 pt-3 mb-3">
        <v-btn depressed small @click="closeCategoryDrawer">CLOSE
          <v-icon right dark>close</v-icon>
        </v-btn>
      </div>
      <v-list class="pl-3 pr-3mb-5">
        <v-list-tile v-for="(category, index) in config.categories" :key="index">
          <v-checkbox
            style="font-size: 12px !important;"
            :label="`${category.name}`"
            @click.native="toggleEvents(category.color)"
            :color="category.color"
            input-value="true"
          ></v-checkbox>
        </v-list-tile>

        <v-list-tile class="mt-5">
          <v-switch label="Show Debug Info" @click.native="debugApp" class="debug"></v-switch>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      :value="eventDrawer"
      fixed
      app
      right
      disable-resize-watcher
      width="400"
      style="background: #eee; z-index: 150"
    >
      <v-list class>
        <div class="text-xs-center">
          <h1
            style="font-size: 22px; border-bottom: 1px solid #ccc; padding-bottom: 8px;"
          >{{selectedDate}}</h1>
        </div>
        <div class="text-xs-center pb-0 pt-3">
          <v-btn depressed small @click="closeEventDrawer">CLOSE
            <v-icon right dark>close</v-icon>
          </v-btn>
        </div>
        <div v-if="!debug">
          <div v-if="!eventStatus" class="text-xs-center">
            <h3 style="color: #888; text-transform: uppercase;" class="mt-3">No Events Scheduled</h3>
          </div>

          <div v-else class="pl-3 pr-3 mt-4 pr-3" ref="eventList">
            <div v-for="(event, index) in this.$store.state.dayMeta.dayEvents" :key="index">
              <v-layout>
                <v-flex xs12>
                  <v-card class="mt-3">
                    <div
                      class="text-xs-right pr-3 pt-2 pb-2"
                      :style="getCategoryBackgroundColor(event.color)"
                    >{{event.category}}</div>
                    <div :style="getBackgroundColor(event.color)" class="pl-3 pt-2 pr-3 pb-2">
                      <span style="text-transform: uppercase; color: #fff;">{{event.title}}</span>
                    </div>
                    <div class="pt-2 pl-3 pr-2 pb-4">
                      <span>
                        <span v-html="getEventRange(event)" class="eventRange"></span>
                      </span>
                      <span style="float: right">
                        <span class="duration">{{getDuration(event.duration)}}</span>
                      </span>

                      <div v-html="markdownToHtml(event.description)" class="description mt-3"></div>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </div>

        <div v-if="debug" class="pl-3 pr-3 mt-4">
          <strong>Day Meta:</strong>
          <tree-view :data="this.$store.state.dayMeta" :options="{maxDepth: 3}"></tree-view>

          <br>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark app color="indigo darken-4">
      <v-toolbar-side-icon @click.stop="toggleCategoryDrawer" v-if="this.$store.getters.isLoggedIn"></v-toolbar-side-icon>
      <router-link to="/" class="nav">
        <v-toolbar-title class="text-uppercase">
          <span class style="color: #fff; font-weight: 900">ILLINOIS</span> |
          <span class="font-weight: 900" style="color: #eee">{{navTitle}}</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <!-- <v-btn dark @click="logout" color="indigo accent-2" v-if="!isCondensed">
        <v-icon>lock_open</v-icon>
      </v-btn>-->
      <div v-if="this.$store.getters.isLoggedIn">
        <v-btn icon @click="refresh" v-if="!isCondensed">
          <v-icon>refresh</v-icon>
        </v-btn>
      </div>
      <v-menu offset-y nudge-left="100" transition="slide-x-transition" style="z-index: 150;">
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list dark>
          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>today</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/" class="link">Home</router-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-divider class="mb-2 mt-2" v-if="this.$store.getters.isLoggedIn"></v-divider>

          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>add</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <a
                href="https://calendar.icjia-api.cloud/admin"
                class="link"
                target="_blank"
              >Add New Event</a>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>refresh</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <a href="/" class="link">Refresh Events</a>
            </v-list-tile-title>
          </v-list-tile>
          <v-divider class="mb-2 mt-2" v-if="this.$store.getters.isLoggedIn"></v-divider>
          <v-list-tile>
            <v-icon left>markunread</v-icon>&nbsp;&nbsp;
            <v-list-tile-title @click="closeEventDrawer">
              <router-link to="/contact" class="link">Contact Support</router-link>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-icon left>redo</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/forgot" class="link">Reset Password</router-link>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>lock_open</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/login" class="link">Log Out</router-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <!-- <v-icon left>lock_open</v-icon>&nbsp;&nbsp; -->
            <v-list-tile-title>
              <router-link to="/login" class="link">
                <span
                  v-if="!isCondensed"
                  style="color:#8C9EFF; font-size: 14px"
                >&nbsp;&nbsp;{{this.$store.state.userMeta.email}}</span>
              </router-link>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-else>
            <v-icon left>lock</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/login" class="link">Log In</router-link>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-toolbar-side-icon @click.stop="toggleEventDrawer" v-if="this.$store.getters.isLoggedIn"></v-toolbar-side-icon>
    </v-toolbar>
  </div>
</template>

<script>
/* eslint-disable */
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true
});
import moment from "moment";
import { EventBus } from "../event-bus.js";
import config from "@/config";
export default {
  mounted() {},
  methods: {
    getBackgroundColor(color) {
      return `margin: 0; padding: 0; border-top: 1px solid #aaa; background-color: ${color} !important; color: #eee !important; font-weight: bold; text-transform: uppercase;`;
    },
    getCategoryBackgroundColor(color) {
      return `padding: 0; margin: 0; font-size: 10px; background-color: ${color} !important; color: #eee !important; font-weight: bold; text-transform: uppercase;`;
    },
    getDuration(num) {
      if (num < 1) {
        return `1 day`;
      }
      return `${num} days`;
    },
    getEventRange({ start, end, duration }) {
      if (duration === 0) {
        return moment.utc(start).format("MMM DD, YYYY");
      }

      return `${moment.utc(start).format("MMM DD, YYYY")} - ${moment
        .utc(end)
        .format("MMM DD, YYYY")}`;
    },
    pushRoute(route) {
      this.drawer = true;
      // this.expand = false
      this.$router.push({ path: route });
    },
    logout() {
      console.log("logout here");
    },
    refresh() {
      window.location = "/";
    },

    debugApp() {
      this.$store.commit("TOGGLE_DEBUG", this.$store.state.debug);
    },
    formattedDate() {
      this.selectedDate = this.$store.state.dayMeta.fullDate;
    },

    toggleEvents(color) {
      let isVisible = [];
      if (this.$store.getters.visibleEvents.includes(color)) {
        isVisible = _.remove(this.$store.getters.visibleEvents, function(n) {
          return n !== color;
        });

        this.$store.dispatch("setVisibleEvents", isVisible);
      } else {
        isVisible = this.$store.getters.visibleEvents;
        isVisible.push(color);

        this.$store.dispatch("setVisibleEvents", isVisible);
      }
    },
    toggleCategoryDrawer() {
      this.$store.commit("TOGGLE_CATEGORY_DRAWER");
    },
    closeCategoryDrawer() {
      this.$store.commit("CLOSE_CATEGORY_DRAWER");
    },
    toggleEventDrawer() {
      this.$store.commit("TOGGLE_EVENT_DRAWER");
    },
    closeEventDrawer() {
      this.$store.commit("CLOSE_EVENT_DRAWER");
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

  computed: {
    navTitle() {
      if (this.$vuetify.breakpoint.xs) {
        return "ICJIA";
      } else {
        return "Criminal Justice Information Authority";
      }
    },
    debug() {
      return this.$store.state.debug;
    },
    currentDate() {
      return moment().format("MMMM YYYY");
    },
    eventDrawer() {
      return this.$store.state.eventDrawer;
    },
    categoryDrawer() {
      return this.$store.state.categoryDrawer;
    },
    isLoading() {
      return this.$store.getters.isLoading;
    },
    eventStatus() {
      try {
        if (this.$store.state.dayMeta.dayEvents.length > 0) {
          return true;
        }
      } catch {
        return false;
      }
    },
    selectedDate() {
      return moment(this.$store.state.dayMeta.fullDate).format(
        "dddd, MMMM DD, YYYY"
      );
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
  },

  data() {
    return {
      drawer: false,
      expand: false,
      config: config
    };
  }
};
</script>

<style>
.nav-state {
  font-weight: 900;
}

a {
  text-decoration: none;
}

a {
  color: #fff;
}

/* .debug.v-input--selection-controls.v-input .v-label {
  font-weight: 900;

  font-size: 12px;
} */

a:hover {
  color: #ccc;
}
.description a {
  font-weight: bold;
}
.description a:hover {
  color: #333;
  text-decoration: underline;
}

a.link {
  color: #fff;
}

a.link:hover {
  color: #ccc;
}

.v-label {
  font-size: 12px !important;
  font-weight: 900 !important;
  color: #666 !important;
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
</style>