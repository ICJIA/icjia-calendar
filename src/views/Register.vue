<template>
  <div class="page-height">
    <v-container fill-height>
      <v-layout row class="text-xs-center" align-center justify-center>
        <v-flex xs12 sm6 class="animated bounceInDown mt-3 mb-3">
          <v-card class="pt-1 pb-5">
            <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
              <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
              <div
                style="color: #fff; font-weight: bold; font-size: 16px"
                class="mt-2"
              >User Registration</div>
            </div>
            <form class="pt-5 pl-3 pr-3">
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="Valid @illinois.gov email"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                aria-label="Email"
                @click.native="clearStatus"
                @keyup.enter="submit"
                ref="email"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="Password"
                :append-icon="e3 ? 'visibility' : 'visibility_off'"
                @click:append="() => (e3 = !e3)"
                :type="e3 ? 'password' : 'text'"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                aria-label="Password"
                @click.native="clearStatus"
                @keyup.enter="submit"
                class="mt-2"
              ></v-text-field>
              <v-text-field
                v-model="repeatPassword"
                :error-messages="repeatPasswordErrors"
                label="Verify Password"
                :append-icon="e4 ? 'visibility' : 'visibility_off'"
                @click:append="() => (e4 = !e4)"
                :type="e4 ? 'password' : 'text'"
                aria-label="Verify Password"
                @input="$v.repeatPassword.$touch()"
                @blur="$v.repeatPassword.$touch()"
                class="mt-2"
                @click.native="clearStatus"
                @keyup.enter="submit"
              ></v-text-field>
              <div
                class="mt-3 text-xs-center"
                style="height: 50px; font-weight: bold"
              >{{this.$store.state.status}}</div>
              <div v-if="!disabled" class="text-xs-center">
                <v-btn @click="submit">Register</v-btn>&nbsp;
                <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
              </div>
              <div v-else class="text-xs-center">
                <v-btn to="/login">Log in</v-btn>
              </div>
            </form>

            <!-- <tree-view :data="this.$v" :options="{maxDepth: 3}"></tree-view> -->
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  alphaNum,
  sameAs,
  email
} from "vuelidate/lib/validators";
import passwordComplexity from "@/validators/passwordComplexity";
import illinoisDotGov from "@/validators/illinoisDotGov";
import config from "@/config";
export default {
  mixins: [validationMixin],

  components: {},

  mounted() {
    this.$nextTick(this.$refs.email.focus);
  },

  validations: {
    email: { required, email, illinoisDotGov },
    password: {
      required,
      minLength: minLength(8),
      passwordComplexity
    },
    repeatPassword: {
      sameAsPassword: sameAs("password")
    }
  },
  data() {
    return {
      name: "",
      e3: true,
      e4: true,
      email: "",
      password: "",
      repeatPassword: "",
      username: "",
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

    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must have minimum 8 characters.");
      !this.$v.password.required && errors.push("Password is required.");

      !this.$v.password.passwordComplexity &&
        errors.push(
          "Weak password. Please provide at least one uppercase letter and one number. "
        );
      return errors;
    },
    repeatPasswordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.repeatPassword.sameAsPassword &&
        errors.push("Passwords must match");
      return errors;
    },
    isLoading() {
      return this.$store.getters.isLoading;
    },

    isSuccess(v) {
      return !this.$v.$invalid && this.$v.$dirty;
    }
  },
  methods: {
    clearStatus() {
      this.$store.commit("CLEAR_STATUS");
      this.$store.dispatch("logout");
    },
    submit() {
      this.$v.$touch();

      if (this.isSuccess) {
        this.$store.commit("START_LOADER");
        this.showLoader = true;
        let payload = {
          username: this.email.toLowerCase(),
          email: this.email.toLowerCase(),
          password: this.password
        };
        this.$store
          .dispatch("register", payload)
          .then(() => {
            this.$store.commit("STOP_LOADER");
            console.log("Success!");
            this.disabled = true;
          })
          .catch(err => {
            console.log(JSON.stringify(err));
            this.$store.commit("STOP_LOADER");
          });
      }
    }
  }
};
</script>

<style scoped>
</style>