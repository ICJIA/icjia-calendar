<template>
  <v-footer dark height="auto">
    <v-card
      flat
      tile
      class="lighten-1 white--text text-xs-center pt-0 pb-2"
      style="width: 100% !important"
    >
      <v-card-text class="white--text pt-2 pb-2 mt-2" style="font-size: 12px;">
        <div class="mt-1 mb-2">
          <v-tooltip right open-delay="400">
            <v-btn
              slot="activator"
              color="grey darken-1"
              style="font-size: 10px"
              dark
              :href="info.repository"
              target="_blank"
            >
              <v-icon size="10px">fab fa-github</v-icon>
              &nbsp;
              Version: {{info.version}}
            </v-btn>
            <span>Find me on Github</span>
          </v-tooltip>
        </div>&copy;&nbsp;
        <a href="http://www.icjia.state.il.us">
          {{year}}
          Illinois Criminal Justice Information Authority
        </a>&nbsp;|&nbsp;
        <router-link to="/contact">Contact ICJIA Web Support</router-link>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
const info = require("../../package.json");

export default {
  data: () => ({
    icons: ["fab fa-github"],
    info: info
  }),
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>
a {
  color: #eee !important;
}
a:hover {
  color: #aaa !important;
}
</style>