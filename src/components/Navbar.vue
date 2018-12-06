<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed clipped app disable-resize-watcher width="250">
      <v-list class="pl-3 pr-3 mt-5">
        <v-list-tile v-for="color in this.$store.state.appColors" :key="color">
          <v-switch :label="`${color}`" @click.native="toggleEvents(color)" input-value="true"></v-switch>
        </v-list-tile>
        <v-divider></v-divider>

        <v-list-tile>
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
    >
      <v-list class>
        <div style="background-color: #fff" class="text-xs-center">
          <h1
            style="font-size: 22px; border-bottom: 1px solid #ccc; padding-bottom: 8px;"
          >{{selectedDate}}</h1>
        </div>
        <div v-if="!eventStatus" class="text-xs-center">
          <h3 style="color: #888; text-transform: uppercase;" class="mt-3">No Events Scheduled</h3>
        </div>

        <div v-else class="pl-3 pr-3 mt-4 pr-3">
          <div v-for="(event, index) in this.$store.state.dayMeta.dayEvents" :key="index">
            <h2 style="color: #666; text-transform: uppercase">{{event.title}}</h2>
            <p>{{event.description}}</p>
          </div>
        </div>

        <div v-if="debug" class="pl-3 pr-3 mt-4">
          <strong>Day Meta:</strong>
          {{this.$store.state.dayMeta}}
          <br>
          <div class="mt-3">
            <strong>Vuex data:</strong>
            <br>
            currentYear: {{this.$store.state.currentYear}}
            <br>
            currentMonth: {{this.$store.state.currentMonth}}
            <br>
            currentDay: {{this.$store.state.currentDay}}
            <br>
            debug: {{this.$store.state.debug}}
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/" class="nav">
        <v-toolbar-title class="text-uppercase">
          <span class style="color: #111; font-weight: 900">ILLINOIS</span> |
          <span class="font-weight: 900" style="color: #25274D">{{navTitle}}</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <!-- <v-btn
        flat
        href="https://calendar.icjia-api.cloud/admin"
        target="_blank"
        style="color: #333 !important; font-size: 12px;"
      >
        <v-icon>event</v-icon>&nbsp;Add New Event
      </v-btn>-->
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-menu offset-y nudge-left="100">
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list light>
          <v-list-tile>
            <v-list-tile-title>
              <router-link to="/" class="link">View Calendar</router-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title>
              <a
                href="https://calendar.icjia-api.cloud/admin"
                target="_blank"
                class="link"
              >Add New Event</a>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title @click="closeEventDrawer">
              <router-link to="/contact" class="link">Contact Support</router-link>
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
export default {
  mounted() {},
  methods: {
    pushRoute(route) {
      this.drawer = true;
      // this.expand = false
      this.$router.push({ path: route });
    },
    refresh() {
      console.log("refresh API here");
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
    eventStatus() {
      if (this.$store.state.dayMeta.dayEvents.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    selectedDate() {
      return moment(this.$store.state.dayMeta.fullDate).format(
        "dddd, MMMM DD, YYYY"
      );
    }
  },

  data() {
    return {
      drawer: false,
      expand: false
    };
  }
};
</script>

<style scoped>
.nav-state {
  font-weight: 900;
}

a {
  text-decoration: none;
}

a.link {
  color: #333 !important;
}

a.link:hover {
  color: #666 !important;
}

/* .debug.v-input--selection-controls.v-input .v-label {
  font-weight: 900;

  font-size: 12px;
} */
</style>