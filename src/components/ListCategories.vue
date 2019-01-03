<template>
  <div>
    <v-list class="pl-3 pr-3mb-5">
      <v-list-tile v-for="(category, index) in config.app.categories" :key="index">
        <v-checkbox
          :label="`${category.name}`"
          @click.native="toggleEvents(category.color)"
          :color="category.color"
          input-value="true"
          class="category"
        ></v-checkbox>
      </v-list-tile>

      <!-- <v-list-tile class="mt-5">
        <v-switch label="Show Debug Info" @click.native="debugApp" class="debug"></v-switch>
      </v-list-tile>-->
    </v-list>
  </div>
</template>

<script>
import config from "@/config";
import _ from "lodash";
export default {
  methods: {
    toggleEvents(color) {
      let isVisible = [];
      if (this.$store.getters.visibleEvents.includes(color)) {
        isVisible = _.remove(this.$store.getters.visibleEvents, function(n) {
          return n !== color;
        });
        this.$store.dispatch("setVisibleEvents", isVisible);
      } else {
        isVisible = this.$store.getters.visibleEvents;
        isVisible.push(color);
        this.$store.dispatch("setVisibleEvents", isVisible);
      }
    },
    debugApp() {
      this.$store.commit("TOGGLE_DEBUG", this.$store.state.debug);
    }
  },
  computed: {},
  data() {
    return {
      config: config
    };
  }
};
</script>

<style>
.category label {
  font-size: 12px !important;
  font-weight: bold;
}
</style>
