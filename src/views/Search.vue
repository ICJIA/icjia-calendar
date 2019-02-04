<template >
  <div style="background: #fff; min-height: 100vh">
    <v-tabs centered color="grey lighten-2" icons-and-text style="margin-top: 64px">
      <v-tabs-slider color="accent"></v-tabs-slider>

      <v-tab href="#search">Search Events
        <v-icon>search</v-icon>
      </v-tab>

      <v-tab href="#list">Filter Events
        <v-icon>list</v-icon>
      </v-tab>

      <v-tab-item value="search">
        <div class="text-xs-center mt-5" v-if="!isReady">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <v-card flat v-if="isReady">
          <search-events></search-events>
        </v-card>
      </v-tab-item>

      <v-tab-item value="list">
        <div class="text-xs-center mt-5" v-if="!isReady">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <v-card flat v-if="isReady">
          <filter-events></filter-events>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
// import config from "@/config";
import SearchEvents from "@/components/SearchEvents";
import FilterEvents from "@/components/FilterEvents";
// import { EventBus } from "@/event-bus.js";
export default {
  created() {
    this.isReady = false;
    this.$store
      .dispatch("getData")
      .then(response => this.$store.dispatch("structureData", response))
      .then(r => {
        console.log(r);
        this.isReady = true;
      });
  },
  mounted() {},
  components: {
    SearchEvents,
    FilterEvents
  },
  data() {
    return {
      events: null,
      isReady: false
    };
  }
};
</script>
