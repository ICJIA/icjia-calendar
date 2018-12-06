<template>
  <v-app>
    <navbar/>

    <v-content>
      <div
        v-if="$browserDetect.isIE"
        class="text-xs-center pt-5 pb-5 mt-3 mb-3"
        style="background-color: red"
      >
        <h1 style="color: white">
          Your browser is out of date.
          <br>In order to view this calendar, please update to the latest
          <br>
          <a href="https://www.google.com/chrome/">Chrome</a>,
          <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>, or
          <a href="https://www.microsoft.com/en-us/windows/microsoft-edge">Microsoft Edge</a>.
        </h1>
        <h3 class="mt-4">Need help with the update?
          <router-link to="/contact">Contact ICJIA Tecnical Support</router-link>&nbsp;for assistance.
        </h3>
      </div>
      <div v-if="isLoading">
        <v-progress-linear :indeterminate="true" style="padding: 0; margin: 0" height="4"></v-progress-linear>
      </div>
      <div v-else style="height: 4px;"></div>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { createCalendarHelper } from "@/utils";

import Navbar from "@/components/Navbar";
import { getDayMeta } from "@/utils";
export default {
  name: "App",
  components: {
    Navbar
  },
  created() {
    this.$store.dispatch("setApiData", require("@/api/index.json"));
    this.$store.dispatch("setCurrentYear", parseInt(new Date().getFullYear()));
    this.$store.dispatch(
      "setCurrentMonth",
      parseInt(new Date().getMonth()) + 1
    );
    this.$store.dispatch("setCurrentDay", parseInt(new Date().getUTCDate()));
    this.$store.dispatch("setMinYear", 2014);
    this.$store.dispatch("setMaxYear", 2099);
    this.$store.dispatch(
      "setCalendarMeta",
      createCalendarHelper(this.minYear, this.maxYear)
    );
    // auto-populate eventDrawer with today's info
    let gridID =
      this.calendarMeta[this.currentYear][this.currentMonth - 1]
        .startDayOfWeek + this.currentDay;

    let meta = getDayMeta(gridID, this.$store);
    this.$store.dispatch("setDayMeta", meta);

    let noEvents = [];
    if (this.apiData[meta.year][meta.dayOfYear]) {
      this.$store.dispatch(
        "setDayEvents",
        this.apiData[meta.year][meta.dayOfYear]
      );
    } else {
      this.$store.dispatch("setDayEvents", noEvents);
    }
  },
  methods: {},
  computed: {
    minYear() {
      return this.$store.getters.minYear;
    },
    maxYear() {
      return this.$store.getters.maxYear;
    },
    currentYear() {
      return this.$store.getters.currentYear;
    },
    currentMonth() {
      return this.$store.getters.currentMonth;
    },
    currentDay() {
      return this.$store.getters.currentDay;
    },
    calendarMeta() {
      return this.$store.getters.calendarMeta;
    },
    apiData() {
      return this.$store.getters.apiData;
    },
    isLoading() {
      return this.$store.getters.isLoading;
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
a {
  color: #aaa !important;
}

.header-link {
  color: #222;
}

.subheader-link {
  color: #222;
}

a {
  color: #ddd !important;
}
</style>
