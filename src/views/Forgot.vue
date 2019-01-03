<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs12 sm6 class="animated bounceInDown mt-3 mb-3">
        <v-card class="pt-1 pb-5">
          <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
            <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
            <div style="color: #fff; font-weight: bold; font-size: 16px" class="mt-2">RESET PASSWORD</div>
          </div>
          <form class="pt-5 pl-3 pr-3" @submit="submit" onSubmit="return false;">
            <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              label="Your @illinois.gov email"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              aria-label="Email"
              @click.native="clearStatus"
              :disabled="disabled"
              ref="email"
            ></v-text-field>

            <div
              class="mt-3 text-xs-center"
              style="height: 50px; font-weight: bold"
            >{{this.$store.state.status}}</div>
            <div v-if="!disabled" class="text-xs-center">
              <v-btn @click="submit">Send Reset Link</v-btn>&nbsp;
              <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
            </div>

            <!-- <div v-else class="text-xs-center">
                <v-btn to="/login">Back to Log in</v-btn>
            </div>-->
          </form>

          <!-- <tree-view :data="this.$v" :options="{maxDepth: 3}"></tree-view> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import illinoisDotGov from "../validators/illinoisDotGov";

export default {
  mixins: [validationMixin],

  components: {},
  created() {
    this.$store.commit("CLEAR_STATUS");
    this.$store.dispatch("logout");
  },

  mounted() {
    this.$nextTick(this.$refs.email.focus);
  },

  validations: {
    email: { required, email, illinoisDotGov }
  },
  data() {
    return {
      name: "",
      email: "",
      showSubmit: true,
      showLoader: false,
      successMessage: "",
      disabled: false
    };
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push("Email is required.");
      !this.$v.email.email && errors.push("Not a valid e-mail address.");
      !this.$v.email.illinoisDotGov &&
        errors.push("You must use a valid @illinois.gov email adddress.");
      return errors;
    },

    isLoading() {
      return this.$store.getters.isLoading;
    },

    isSuccess() {
      return !this.$v.$invalid && this.$v.$dirty;
    }
  },
  methods: {
    clearStatus() {
      this.$store.commit("CLEAR_STATUS");
    },
    submit() {
      this.$v.$touch();

      if (this.isSuccess) {
        let email = this.email.toString().toLowerCase();
        this.$store.dispatch("forgot", email).then(r => {
          if (r.data.ok) {
            this.disabled = true;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
