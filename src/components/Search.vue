<template>
  <div>
    <v-container>
      <v-flex xs12 sm12 md10 offset-md1>{{test}}</v-flex>
    </v-container>
  </div>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import _ from "lodash";
import Fuse from "fuse.js";
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);

export default {
  mounted() {
    // this.fuse = new Fuse(this.events, config.app.search);
    // EventBus.$on("refresh", () => {
    //   this.fuse = new Fuse(this.events, config.app.search);
    //   this.result = this.fuse.search(this.query);
    // });
  },

  props: {
    events: {
      type: Array
    }
  },
  data() {
    return {
      order: "asc",
      structuredData: []
    };
  },
  methods: {},
  computed: {
    test() {
      return this.events;
    }
  }
};
</script>

<style scoped>
</style>