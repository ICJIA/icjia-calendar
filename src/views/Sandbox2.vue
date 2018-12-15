<template>
  <div class="page-height">
    <v-container fill-height class="px-3 mt-5" id="page-content">
      <v-layout row wrap>
        <v-flex xs10 offset-xs1 style="margin-top: 50px">
          <div>
            <form style="margin-top: 0px">
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="Valid @illinois.gov email"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                aria-label="Email"
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
              ></v-text-field>
              <div
                class="mt-3 text-xs-center"
                style="height: 50px; font-weight: bold"
              >{{this.$store.state.status}}</div>
              <div v-if="!disabled" class="text-xs-center">
                <v-btn @click="submit">submit</v-btn>
              </div>
            </form>

            <!-- <tree-view :data="this.$v" :options="{maxDepth: 3}"></tree-view> -->
          </div>
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
import axios from "axios";
import config from "@/config";
export default {
  mixins: [validationMixin],

  components: {},

  mounted() {},

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
      showAxiosError: false,
      axiosError: "",
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

    isSuccess(v) {
      return !this.$v.$invalid && this.$v.$dirty;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();

      if (this.isSuccess) {
        this.showLoader = true;
        let payload = {
          username: this.email.toLowerCase(),
          email: this.email.toLowerCase(),
          password: this.password
        };
        this.$store
          .dispatch("register", payload)
          .then(() => {
            console.log("Success!");
            this.disabled = true;
          })
          .catch(err => console.log(JSON.striginfy(err)));
      }
    }
  }
};
</script>

<style scoped>
</style>