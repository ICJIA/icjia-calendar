<template>
  <div>
    <v-toolbar class="navCalendar" color="grey lighten-3">
      <v-btn fab dark small color="primary" @click="getPreviousMonth()">
        <v-icon dark>remove</v-icon>
      </v-btn>

      <v-btn dark small color="primary" @click="getToday()" v-if="!isCondensed">Today</v-btn>

      <v-btn fab dark small color="primary" @click="getNextMonth()">
        <v-icon dark>add</v-icon>
      </v-btn>

      <h1>{{thisMonth}}</h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <v-switch
        label="Condensed View"
        v-model="condensedCalendarView"
        v-if="!isCondensed"
        class="pt-4"
      ></v-switch>
      <v-spacer></v-spacer>
      <div>
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

    condensedCalendarView: {
      get() {
        return this.$store.getters.condensedCalendarView;
      },
      set(val) {
        this.$store.commit("TOGGLE_CONDENSED_CALENDAR_VIEW");
      }
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
