<template>
  <v-app>
    <nav-primary></nav-primary>
    <div v-if="isLoading" style="z-index: 1000">
      <v-progress-linear
        :indeterminate="true"
        color="blue-grey lighten-3"
        style="position: fixed; top: -15px;"
        height="5"
      ></v-progress-linear>
    </div>

    <div
      v-if="$browserDetect.isIE"
      class="text-xs-center pt-5 pb-5"
      style="background-color: red; margin-top: 140px;"
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
        <router-link to="/contact">Contact ICJIA Technical Support</router-link>&nbsp;for assistance.
      </h3>
    </div>

    <v-content>
      <router-view/>
    </v-content>
    <my-footer/>
  </v-app>
</template>

<script>
import NavPrimary from "@/components/NavPrimary.vue";
import MyFooter from "@/components/MyFooter";
import moment from "moment";
import { EventBus } from "@/event-bus.js";
export default {
  name: "App",

  components: {
    NavPrimary,
    MyFooter
  },
  created() {
    this.$http.interceptors.response.use(undefined, function(err) {
      console.log(err);
      return new Promise(function(resolve) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
          resolve();
        }
        throw err;
      });
    });
  },
  mounted() {
    this.$store.dispatch("setSelectedDate", moment().startOf("day"));
    this.$store.dispatch("setCurrentDate", moment().startOf("day"));

    EventBus.$on("setToday", () => {
      this.$store.dispatch("setSelectedDate", moment().startOf("day"));
      this.$store.dispatch("setCurrentDate", moment().startOf("day"));
      console.log("Event: Set today");
    });
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading;
    }
  },
  methods: {},
  data() {
    return {};
  }
};
</script>
