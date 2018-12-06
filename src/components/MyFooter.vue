<template>
  <v-footer dark height="auto">
    <v-card flat tile class="lighten-1 white--text text-xs-center" style="width: 100% !important">
      <!-- <v-card-text>
        <v-btn v-for="icon in icons" :key="icon" class="white--text" icon>
          <v-icon size="28px">{{ icon }}</v-icon>
        </v-btn>
      </v-card-text>-->
      <v-divider></v-divider>
      <v-card-text class="white--text pt-2 pb-2" style="font-size: 12px; background: #666">
        &copy;&nbsp;{{year}} —
        <strong>Illinois Criminal Justice Information Authority</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: ["fab fa-github"]
  }),
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>
footer {
  background: #ccc !important;
}
</style>