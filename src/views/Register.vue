<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs12 sm6 class="grey lighten-4 animated zoomIn fast">
        <v-card class>
          <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
            <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
            <div style="color: #fff; font-weight: bold; font-size: 16px" class="mt-2">REGISTER</div>
          </div>

          <div class="pr-3 pl-3 pt-3 pb-3">
            <v-form @submit="login" onSubmit="return false;">
              <v-text-field
                prepend-icon="person"
                name="identifier"
                label="username or email"
                v-model="identifier"
                autocomplete="identifier"
                ref="identifier"
                @keydown.enter="login"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="password"
                type="password"
                v-model="password"
                autocomplete="password"
                @keydown.enter="login"
              ></v-text-field>

              <v-card-actions class="pt-5">
                <v-btn primary large block @click="login">Register&nbsp;</v-btn>
              </v-card-actions>
              <div
                style="font-size: 18px; height: 50px; font-weight: bold"
                class="mt-3"
              >{{this.$store.state.status}}</div>
            </v-form>
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
</style>