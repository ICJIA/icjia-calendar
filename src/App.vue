<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>ICJIA |</span>
        <span class="font-weight-light">&nbsp;Calendar Test</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

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
      this.$store.commit('TOGGLE_DEBUG', this.isDebug)
    }
  },
  computed: {
    isDebug() {
      return this.$store.getters.debug
    }
  },
  data() {
    return {
      
    };
  }
};
</script>

<style>

</style>
