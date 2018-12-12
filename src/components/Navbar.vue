<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed clipped app disable-resize-watcher width="250">
      <v-list class="pl-3 pr-3 mt-5 mb-5">
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
      clipped
      app
      stateless
      right
      disable-resize-watcher
      width="325"
      style="background: #eee"
    >
      <v-list class>
        <div class="text-xs-center">
          <h1
            style="font-size: 22px; border-bottom: 1px solid #ccc; padding-bottom: 8px;"
          >{{selectedDate}}</h1>
        </div>
        <div v-if="!eventStatus" class="text-xs-center">
          <h3 style="color: #888; text-transform: uppercase;" class="mt-3">No Events Scheduled</h3>
        </div>

        <div v-else class="pl-3 pr-3 mt-4 pr-3" ref="eventList">
          <div v-for="(event, index) in this.$store.state.dayMeta.dayEvents" :key="index">
            <v-layout>
              <v-flex xs12>
                <v-card class="mt-3">
                  <div
                    class="text-xs-right pr-3 pt-3"
                    :style="getCategoryBackgroundColor(event.color)"
                  >{{event.category}}</div>
                  <v-card-title primary-title :style="getBackgroundColor(event.color)">
                    <div class="pb-3">
                      <div
                        style="text-transform: uppercase; color: #fff; font-size: 18px;"
                      >{{event.title}}</div>
                    </div>
                  </v-card-title>
                  <div class="pt-2 pl-3 pr-2 pb-4">{{event.description}}</div>
                </v-card>
              </v-flex>
            </v-layout>
          </div>
        </div>

        <div v-if="debug" class="pl-3 pr-3 mt-4">
          <strong>Day Meta:</strong>
          <tree-view :data="this.$store.state.dayMeta" :options="{maxDepth: 3}"></tree-view>

          <br>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark app color="indigo darken-1">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/" class="nav">
        <v-toolbar-title class="text-uppercase">
          <span class style="color: #fff; font-weight: 900">ILLINOIS</span> |
          <span class="font-weight: 900" style="color: #eee">{{navTitle}}</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn dark @click="logout" color="indigo accent-2" v-if="!isCondensed">
        <!-- <span class="mr-2">SIGN OUT</span> -->
        <v-icon>lock_open</v-icon>
      </v-btn>
      <!-- <v-btn icon @click="refresh">
        <v-icon>refresh</v-icon>
      </v-btn>-->
      <v-menu offset-y nudge-left="100" transition="slide-x-transition">
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list dark>
          <v-list-tile>
            <v-list-tile-title>
              <a href="/" class="link">Refresh Calendar</a>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-title @click="closeEventDrawer">
              <router-link to="/contact" class="link">Contact Support</router-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title>
              <router-link to="/" class="link">Sign Out</router-link>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-toolbar-side-icon @click.stop="toggleEventDrawer"></v-toolbar-side-icon>
    </v-toolbar>
  </div>
</template>

<script>
/* eslint-disable */
import moment from "moment";
import { EventBus } from "../event-bus.js";
import { config } from "@/config";
export default {
  mounted() {
    console.log(this.config);
  },
  methods: {
    getBackgroundColor(color) {
      return `border-top: 1px solid #aaa; background-color: ${color} !important; color: #eee !important; font-weight: bold; text-transform: uppercase;`;
    },
    getCategoryBackgroundColor(color) {
      return `padding-bottom: 12px; font-size: 10px; background-color: ${color} !important; color: #eee !important; font-weight: bold; text-transform: uppercase;`;
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
    toggleEventDrawer() {
      this.$store.commit("TOGGLE_EVENT_DRAWER");
    },
    closeEventDrawer() {
      this.$store.commit("CLOSE_EVENT_DRAWER");
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

/* .debug.v-input--selection-controls.v-input .v-label {
  font-weight: 900;

  font-size: 12px;
} */

.v-label {
  font-size: 12px !important;
  font-weight: 900 !important;
  color: #666 !important;
}
</style>