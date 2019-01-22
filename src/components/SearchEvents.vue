<template>
  <div>{{searchEvents}}</div>
</template>

<script>
import Fuse from "fuse.js";
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);
import { EventBus } from "@/event-bus.js";
export default {
  props: {
    events: {
      type: Array
    }
  },
  data() {
    return {
      searchEvents: this.$store.state.data
    };
  }
};
</script>

<style scoped>
.eventCard:hover {
  cursor: pointer;
}
</style>
