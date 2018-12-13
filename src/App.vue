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
        <v-progress-linear :indeterminate="true" style="padding: 0; margin: 0" height="5"></v-progress-linear>
      </div>
      <div v-else style="height: 4px;"></div>
      <router-view/>
    </v-content>
    <my-footer/>
  </v-app>
</template>

<script>
import { createCalendarHelper } from "@/utils";
import Navbar from "@/components/Navbar";
import MyFooter from "@/components/MyFooter";
import config from "@/config";

export default {
  name: "App",
  components: {
    Navbar,
    MyFooter
  },
  data() {
    return {
      events: {}
    };
  },
  created() {
    this.appInit();
  },
  methods: {
    appInit() {
      this.$store.dispatch("setMinYear", config.app.minYear);
      this.$store.dispatch("setMaxYear", config.app.maxYear);
      this.$store.dispatch(
        "setCalendarMeta",
        createCalendarHelper(this.minYear, this.maxYear)
      );
    }
  },
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
    },
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  }
};
</script>

<style scoped>
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

/* .theme--light.application {
  background: #bbb !important;
} */
</style>
