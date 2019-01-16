<template>
  <div style="background: #fff; min-height: 100vh">
    <v-tabs centered color="grey lighten-2" icons-and-text style="margin-top: 64px">
      <v-tabs-slider color="accent"></v-tabs-slider>

      <v-tab href="#search">Search Events
        <v-icon>search</v-icon>
      </v-tab>

      <v-tab href="#list">List All Events
        <v-icon>list</v-icon>
      </v-tab>

      <v-tab-item value="search">
        <v-card flat>
          <search></search>
        </v-card>
      </v-tab-item>

      <v-tab-item value="list">
        <v-card flat>
          <event-list></event-list>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
import Search from "@/components/Search";
import EventList from "@/components/MasterEventList";
export default {
  components: {
    Search,
    EventList
  },
  data() {
    return {
      data: null
    };
  }
};
</script>