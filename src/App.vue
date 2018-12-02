<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
          <span class="header-link">ICJIA |</span>
          <span class="font-weight-light subheader-link">&nbsp;Calendar Test</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat to="/sandbox" style="color: #333 !important">Sandbox</v-btn>

      <v-btn flat @click.native="debugApp">
        <v-switch label="Debug"></v-switch>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {
    debugApp() {
      this.$store.commit("TOGGLE_DEBUG", this.isDebug);
    }
  },
  computed: {
    isDebug() {
      return this.$store.getters.debug;
    }
  },
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
  text-decoration: none;
}
</style>
