<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs12 sm6 class="animated bounceInDown">
        <v-card class="pt-1 pb-5">
          <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
            <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
            <div style="color: #fff; font-weight: bold; font-size: 16px" class="mt-2">RESET PASSWORD</div>
          </div>
          <v-form v-if="!hasCode" @submit="reset" onSubmit="return false;" class="mt-5 pl-3 pr-3">
            <v-text-field
              prepend-icon="lock"
              name="password"
              label="password"
              v-model="password"
              type="password"
              autocomplete="password"
              ref="password"
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              name="passwordConfirmation"
              label="passwordConfirmation"
              type="password"
              v-model="passwordConfirmation"
              autocomplete="passwordConfirmation"
            ></v-text-field>
            <div style="color: red; font-size: 12px">{{matchStatus}}</div>
            <v-card-actions class="mt-4">
              <v-btn primary large block @click="reset">Reset</v-btn>
            </v-card-actions>
          </v-form>
          <div v-else class="mt-5">
            <v-btn primary large block @click="forgot">Get password reset link</v-btn>
          </div>

          <div style="height: 50px; font-weight: bold" class="mt-3">{{this.$store.state.status}}</div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  created() {
    this.$store.commit("CLEAR_STATUS");
    let code = this.$route.query.code;
    if (!code) {
      this.hasCode = false;
    } else {
      this.hasCode = true;
      this.code = this.$route.query.code;
    }
  },
  mounted() {
    this.$nextTick(this.$refs.password.focus);
  },
  data() {
    return {
      password: "",
      passwordConfirmation: "",
      matchStatus: "",
      hasCode: false
    };
  },
  methods: {
    forgot() {
      this.$router.push("/forgot");
    },
    reset() {
      let password = this.password.toString();
      let passwordConfirmation = this.passwordConfirmation.toString();
      let payload = {};
      payload.code = this.code;
      payload.password = password;
      payload.passwordConfirmation = passwordConfirmation;

      if (this.password !== this.passwordConfirmation) {
        this.matchStatus = "Passwords must match";
      } else {
        this.matchStatus = "";
        this.$store
          .dispatch("reset", payload)
          .then(() => this.$router.push("/"))
          .catch(err => console.log(err));
      }
    }
  }
};
</script>

<style scoped>
</style>