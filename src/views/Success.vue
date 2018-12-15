<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs12 sm6 class="grey lighten-4 animated zoomIn fast">
        <v-card class>
          <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
            <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
          </div>

          <div class="pr-3 pl-3 pt-3 pb-3 mt-5">
            <h2>Email Successfully Verified</h2>
            <div class="mt-5">
              <v-btn primary large to="/login">Login&nbsp;</v-btn>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {};
</script>

<style scoped>
a {
  font-weight: bold !important;
}
</style>