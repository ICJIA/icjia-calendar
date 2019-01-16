<template>
  <div>
    <v-container>
      <v-flex xs12 sm12 md10 offset-md1>{{data}}</v-flex>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);
import { EventBus } from "@/event-bus.js";
export default {
  created() {
    this.$store.dispatch("getData").then(res => (this.data = res.data));
  },
  mounted() {
    EventBus.$on("refresh", () => {
      this.data = this.$store.state.data.data;
    });
  },
  data() {
    return {
      data: [],
      order: "asc"
    };
  },
  methods: {}
};
</script>

<style scoped>
</style>