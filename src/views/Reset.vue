<template>
  <div class="page-height">
    <v-container fill-height>
      <v-layout row class="text-xs-center" align-center justify-center>
        <v-flex xs12 sm6 class="animated bounceInDown">
          <v-card class="pt-1 pb-5">
            <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
              <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
              <div
                style="color: #fff; font-weight: bold; font-size: 16px"
                class="mt-2"
              >Reset Password</div>
            </div>
            <form class="pt-5 pl-3 pr-3" v-if="hasCode" onSubmit="return false;">
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
                :disabled="disabled"
                class="mt-2"
                ref="password"
              ></v-text-field>
              <v-text-field
                v-model="repeatPassword"
                :error-messages="repeatPasswordErrors"
                label="Verify Password"
                :append-icon="e4 ? 'visibility' : 'visibility_off'"
                @click:append="() => (e4 = !e4)"
                :disabled="disabled"
                :type="e4 ? 'password' : 'text'"
                aria-label="Verify Password"
                @input="$v.repeatPassword.$touch()"
                @blur="$v.repeatPassword.$touch()"
                class="mt-2"
              ></v-text-field>
              <div
                class="mt-3 text-xs-center"
                style="height: 50px; font-weight: bold"
              >{{this.$store.state.status}}</div>
              <div v-if="!disabled" class="text-xs-center">
                <v-btn @click="reset">Reset my Password</v-btn>&nbsp;
                <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
              </div>
              <div v-if="disabled && !sendAnother" class="text-xs-center">
                <router-link to="/login">Log in</router-link>
              </div>
            </form>
            <div v-if="!hasCode" class="mt-5 pl-5 pr-5">
              <v-btn primary large block @click="forgot" class>Get password reset link</v-btn>
            </div>

            <div class="mt-3" v-if="sendAnother">
              <router-link to="/forgot">Send another reset code</router-link>
            </div>

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

  created() {
    this.$store.commit("CLEAR_STATUS");
    this.$store.dispatch("logout");
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

  validations: {
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
      password: "",
      repeatPassword: "",
      showSubmit: true,
      showLoader: false,
      successMessage: "",
      disabled: false,
      hasCode: false,
      code: "",
      sendAnother: false
    };
  },
  computed: {
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
    forgot() {
      this.$router.push("/forgot");
    },
    login() {
      this.$router.push("/");
    },
    reset() {
      this.$v.$touch();
      if (this.isSuccess) {
        this.$store.commit("START_LOADER");
        let password = this.password;
        let repeatPassword = this.repeatPassword;
        let payload = {};
        payload.code = this.code;
        payload.password = password;
        payload.passwordConfirmation = repeatPassword;
        console.log(payload);
        this.$store
          .dispatch("reset", payload)
          .then(() => {
            this.$store.commit("STOP_LOADER");
            this.$store.commit(
              "auth_reset",
              "Success! Your password was reset. Please log in."
            );
            this.disabled = true;
          })
          .catch(err => {
            console.log(JSON.stringify(err));
            this.disabled = true;
            this.$store.commit("STOP_LOADER");
            this.sendAnother = true;
          });
      }
    }
  }
};
</script>

<style scoped>
</style>