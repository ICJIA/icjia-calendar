<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed clipped app disable-resize-watcher>
      <v-list class="pl-3 pr-3 mt-5">
        <v-list-tile v-for="color in this.$store.state.appColors" :key="color">
          <v-switch :label="`${color}`" @click.native="toggleEvents(color)" input-value="true"></v-switch>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/" class="nav">
        <v-toolbar-title class="text-uppercase">
          <span class style="color: #111; font-weight: 900">ILLINOIS</span> |
          <span class="font-weight: 900" style="color: #25274D">{{navTitle}}</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <!-- <v-btn flat to="/sandbox" style="color: #333 !important">Sandbox</v-btn> -->
      <v-btn flat @click.native="debugApp">
        <v-switch label="Debug"></v-switch>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  methods: {
    pushRoute(route) {
      this.drawer = true;
      // this.expand = false
      this.$router.push({ path: route });
    },
    debugApp() {
      this.$store.commit("TOGGLE_DEBUG", this.$store.state.debug);
    },
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
    }
  },

  computed: {
    navTitle() {
      if (this.$vuetify.breakpoint.xs) {
        return "ICJIA";
      } else {
        return "Criminal Justice Information Authority";
      }
    }
  },
  data() {
    return {
      drawer: true,
      expand: false
    };
  }
};
</script>

<style scoped>
.nav-state {
  font-weight: 900;
}

a {
  text-decoration: none;
}
</style>