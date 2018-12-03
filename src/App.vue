<template>
  <v-app>
    <navbar/>

    <v-content>
      <div
        v-if="!$browserDetect.isIE"
        class="text-xs-center pt-5 pb-5"
        style="background-color: #eee"
      >
        <h1 style="color: firebrick">
          Please update your browser to the latest
          <a href="https://www.google.com/chrome/">Chrome</a>,
          <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>, or
          <a href="https://www.microsoft.com/en-us/windows/microsoft-edge">Edge</a>.
        </h1>
        <h4>
          <router-link to="/contact">Contact DoIT staff</router-link>&nbsp;for assistance.
        </h4>
      </div>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { createCalendarHelper } from "@/utils";

import Navbar from "@/components/Navbar";
export default {
  name: "App",
  components: {
    Navbar
  },
  created() {
    this.$store.dispatch("setApiData", require("@/api/index.json"));
    this.$store.dispatch("setCurrentYear", 2018);
    this.$store.dispatch("setCurrentMonth", 12);
    this.$store.dispatch("setMinYear", 2018);
    this.$store.dispatch("setMaxYear", 2021);
    this.$store.dispatch(
      "setCalendarMeta",
      createCalendarHelper(
        this.$store.getters.minYear,
        this.$store.getters.maxYear
      )
    );
  },
  methods: {},
  computed: {},
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
  color: #333 !important;
}
</style>
