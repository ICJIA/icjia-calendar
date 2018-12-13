<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs12 sm6 class="grey lighten-4 animated bounceInDown">
        <v-card class="pb-4">
          <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
            <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
          </div>
          <div class="mt-3 mb-3">
            <h2>Reset My Password</h2>
          </div>
          <div class="pl-3 pr-3">
            <v-form @submit="reset" onSubmit="return false;">
              <v-text-field
                prepend-icon="person"
                name="email"
                label="email"
                v-model="email"
                ref="email"
              ></v-text-field>

              <v-card-actions>
                <v-btn primary :disabled="disabled" large block @click="reset">Send Reset Link</v-btn>
              </v-card-actions>

              <div
                style="height: 50px;font-weight: bold;font-size: 18px; "
                class="mt-3"
              >{{this.$store.state.status}}</div>
            </v-form>
          </div>
          <div class="text-xs-left pl-3" style="font-weight: bold">
            <router-link to="/login">&laquo;&nbsp;Back to log in</router-link>
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
  },
  mounted() {
    this.$nextTick(this.$refs.email.focus);
  },
  data() {
    return {
      email: "",
      disabled: false
    };
  },
  methods: {
    reset() {
      let email = this.email.toString();

      this.$store.dispatch("forgot", email).then(r => {
        if (r.data.ok) {
          this.disabled = true;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>