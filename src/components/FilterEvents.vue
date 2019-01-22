<template>
  <div style="margin-top: 10px">
    <v-container class="pb-5">
      <v-flex xs12 sm12 md10 offset-md1>
        <h1 class="mt-5">Filter Events</h1>
        <!-- <v-select
          :items="categories"
          solo
          item-text="name"
          item-value="name"
          v-model="defaultSelected"
          v-on:change="selectEvent"
          class="mt-3"
        ></v-select>-->
        {{filterEvents}}
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import config from "@/config";
const md = require("markdown-it")(config.app.markdown);

export default {
  mounted() {
    this.categories = config.app.categories.map(c => {
      let obj = {};
      obj.name = c.name;
      obj.slug = c.slug;
      return obj;
    });

    this.categories.unshift({ name: "All Categories" });
  },
  data() {
    return {
      filterEvents: this.$store.state.data
    };
  }
};
</script>

<style scoped>
.eventCard:hover {
  cursor: pointer;
}
</style>