<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs5 class="grey lighten-4 animated zoomIn fast">
        <v-card class v-if="!this.$store.getters.isLoggedIn">
          <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
            <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
          </div>
          <div class="pr-3 pl-3 pt-3 pb-3">
            <v-form>
              <v-text-field
                prepend-icon="person"
                name="identifier"
                label="username"
                v-model="identifier"
                autocomplete="identifier"
                ref="identifier"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="password"
                type="password"
                v-model="password"
                autocomplete="password"
              ></v-text-field>

              <v-card-actions class="pt-5">
                <v-btn primary large block @click="login">Login&nbsp;</v-btn>
              </v-card-actions>
              <div style="height: 50px;" class="mt-3">{{this.$store.state.status}}</div>

              <div class="mt-2 mb-3">
                <router-link to="/forgot">I forgot my password</router-link>
              </div>
            </v-form>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  created() {
    this.$store.commit("CLEAR_STATUS");
    this.$store.dispatch("logout");
  },
  mounted() {
    this.$nextTick(this.$refs.identifier.focus);
  },
  data() {
    return {
      identifier: "",
      password: ""
    };
  },
  methods: {
    login() {
      let identifier = this.identifier;
      let password = this.password;
      let payload = {};
      payload.identifier = identifier;
      payload.password = password;
      this.$store
        .dispatch("login", payload)
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  max-width: 500px;
}
a {
  color: #222;
  text-decoration: underline;
}
</style>