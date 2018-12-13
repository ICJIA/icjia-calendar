<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs5 class="grey lighten-4 animated bounceInDown">
        <transition name="fade">
          <v-card class>
            <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
              <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
            </div>
            <div class="mt-3 mb-3">
              <h2>Reset My Password</h2>
            </div>
            <div class="pl-3 pr-3">
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  name="email"
                  label="email"
                  v-model="email"
                  ref="email"
                ></v-text-field>

                <v-card-actions>
                  <v-btn primary large block @click="reset">Send Reset Link</v-btn>
                </v-card-actions>

                <div style="height: 50px;" class="mt-3">{{this.$store.state.status}}</div>
              </v-form>
            </div>
          </v-card>
        </transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  created() {
    this.$store.commit("CLEAR_STATUS");
  },
  mounted() {
    this.$nextTick(this.$refs.email.focus);
  },
  data() {
    return {
      email: ""
    };
  },
  methods: {
    reset() {
      let email = this.email.toString();
      this.$store.dispatch("forgot", email);
    }
  }
};
</script>

<style scoped>
</style>