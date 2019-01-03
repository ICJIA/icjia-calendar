<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs12 sm6 class="animated zoomIn mt-3 mb-3">
        <v-card class="pt-1 pb-5">
          <div class="text-xs-center pt-3 pb-3" style="background: #1A237E; color: #fff">
            <img src="/logo.png" alt="Illinois Criminal Justice Informtion Authority Login">
            <div style="color: #fff; font-weight: bold; font-size: 16px" class="mt-2">Log in</div>
          </div>
          <v-form class="pt-5 pl-3 pr-3" @submit="submit" onSubmit="return false;">
            <v-text-field
              v-model="identifier"
              :error-messages="identifierErrors"
              label="Your @illinois.gov email"
              @input="$v.identifier.$touch()"
              @blur="$v.identifier.$touch()"
              aria-label="identifier"
              @click.native="clearStatus"
              @keyup.enter="submit"
              ref="identifier"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              label="Password"
              :append-icon="e3 ? 'visibility_off' : 'visibility'"
              @click:append="() => (e3 = !e3)"
              :type="e3 ? 'password' : 'text'"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              aria-label="Password"
              class="mt-2"
              @keyup.enter="submit"
            ></v-text-field>

            <div
              class="mt-3 text-xs-center"
              style="height: 50px; font-weight: bold"
            >{{this.$store.state.status}}</div>
            <div v-if="!disabled" class="text-xs-center">
              <v-btn @click="submit">Log in</v-btn>&nbsp;
              <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else class="text-xs-center">
              <v-btn to="/login">Log in</v-btn>
            </div>
          </v-form>
          <div class="mt-2 mb-3 mt-5" style="font-weight: bold">
            <router-link to="/forgot">Reset your password</router-link>&nbsp;|
            <router-link to="/contact">Contact ICJIA support</router-link>
          </div>

          <!-- <tree-view :data="this.$v" :options="{maxDepth: 3}"></tree-view> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  components: {},
  created() {
    this.$store.commit("CLEAR_STATUS");
    this.$store.dispatch("logout");
  },

  mounted() {
    this.$nextTick(this.$refs.identifier.focus);
  },

  validations: {
    identifier: { required },
    password: {
      required
    }
  },
  data() {
    return {
      name: "",
      e3: true,
      identifier: "",
      password: "",
      showSubmit: true,
      showLoader: false,
      successMessage: "",
      disabled: false
    };
  },
  computed: {
    identifierErrors() {
      const errors = [];
      if (!this.$v.identifier.$dirty) return errors;
      !this.$v.identifier.required && errors.push("Email is required.");
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required.");
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
        this.$store.commit("START_LOADER");
        this.showLoader = true;
        let payload = {};
        payload.identifier = this.identifier.toLowerCase();
        payload.password = this.password;
        this.$store
          .dispatch("login", payload)
          .then(() => {
            this.$store.commit("STOP_LOADER");
            this.$router.push("/");
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
a:hover {
  color: #333;
}
</style>
