<template>
  <div>
    <v-toolbar class="navCalendar" color="grey lighten-3">
      <v-btn fab dark small color="primary" @click="getPreviousMonth()">
        <v-icon dark>remove</v-icon>
      </v-btn>

      <v-btn dark small color="primary" @click="getToday()" v-if="!isCondensed">Today</v-btn>

      <v-btn fab dark small color="primary" @click="getNextMonth()">
        <v-icon dark>add</v-icon>
      </v-btn>&nbsp;&nbsp;&nbsp;&nbsp;
      <h1>{{thisMonth}}</h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <v-spacer></v-spacer>
      <!-- <div v-if="mode==='API_DEV'">
        <v-btn color="error">{{mode}}</v-btn>
      </div>-->
      <div style="width: 75px">
        <div v-if="isLoading">
          <v-progress-circular small indeterminate color="primary"></v-progress-circular>
        </div>
      </div>

      <div v-if="this.$store.state.error">
        <v-btn
          small
          color="error"
          class="white--text"
          @click="logout"
          style="font-size: 11px; font-weight: bold"
        >
          <v-icon left dark>error</v-icon>
          {{this.$store.state.error.type}} error. Click to log out and try again.
        </v-btn>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
import moment from "moment";
import config from "@/config";
export default {
  methods: {
    getNextMonth() {
      this.$store.commit("INCREMENT_MONTH");
    },
    getPreviousMonth() {
      this.$store.commit("DECREMENT_MONTH");
    },
    getToday() {
      this.$store.commit("OPEN_EVENT_DRAWER");
      this.$store.dispatch("setSelectedDate", moment().startOf("day"));
      this.$store.dispatch("setCurrentDate", moment().startOf("day"));
    },
    logout() {
      this.$router.push("/login");
    },
    condenseCalendarView() {
      this.$store.commit("TOGGLE_CONDENSED_CALENDAR_VIEW");
    }
  },
  computed: {
    thisMonth() {
      return moment(this.$store.state.selectedDate)
        .utc()
        .format("MMMM YYYY");
    },
    isLoading() {
      return this.$store.state.isLoading;
    },
    mode() {
      return config.api.mode;
    },

    isCondensed() {
      if (
        this.$vuetify.breakpoint.name === "xs" ||
        this.$vuetify.breakpoint.name === "sm"
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.navCalendar {
  position: fixed;
  top: 60px;
  z-index: 2;
}
</style>
