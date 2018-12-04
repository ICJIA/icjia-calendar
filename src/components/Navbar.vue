<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed clipped app disable-resize-watcher>
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
    <v-navigation-drawer :value="eventDrawer" fixed clipped app right disable-resize-watcher>
      <v-list class="pl-3 pr-3 mt-5">
        <strong>Day Meta:</strong>
        {{this.$store.state.dayMeta}}
        <br>
        <br>
        <strong>Events:</strong>
        {{this.$store.state.dayEvents}}
        <br>
        <br>
        <strong>Store:</strong>
        <br>
        Month: {{this.$store.state.currentMonth}}
        <br>
        Day: {{this.$store.state.currentDay}}
        <br>
        Year: {{this.$store.state.currentYear}}
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

      <v-btn flat href="https://calendar.icjia-api.cloud" style="color: #333 !important">
        <v-icon>event</v-icon>&nbsp;Add Event
      </v-btn>
      <v-toolbar-side-icon @click.stop="toggleEventDrawer"></v-toolbar-side-icon>
    </v-toolbar>
  </div>
</template>

<script>
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
    debugApp() {
      this.$store.commit("TOGGLE_DEBUG", this.$store.state.debug);
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
    currentDate() {
      return moment().format("MMMM YYYY");
    },
    eventDrawer() {
      return this.$store.state.eventDrawer;
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

/* .debug.v-input--selection-controls.v-input .v-label {
  font-weight: 900;

  font-size: 12px;
} */
</style>