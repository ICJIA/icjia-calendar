<template>
  <div class="page-height">
    <v-container fill-height class="px-3 mt-5" id="page-content">
      <v-layout row wrap>
        <v-flex xs10 offset-xs1 style="margin-top: 50px">
          <div>
            <form style="margin-top: 0px">
              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="Password"
                :append-icon="e3 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e3 = !e3)"
                :type="e3 ? 'password' : 'text'"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>
            </form>
            <tree-view :data="this.$v" :options="{maxDepth: 3}"></tree-view>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, alphaNum } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  components: {},

  mounted() {},

  validations: {
    password: { required, alphaNum, minLength: minLength(8) }
  },
  data() {
    return {
      name: "",
      e3: true,
      password: ""
    };
  },
  computed: {
    passwordErrors() {
      const errors = [];
      !this.$v.password.minLength &&
        errors.push("Password must have minimum 8 characters.");
      !this.$v.password.required && errors.push("Password is required");
      !this.$v.password.alphaNum &&
        errors.push("Password must be Alpha Numeric characters.");
      return errors;
    },

    isSuccess(v) {
      return !this.$v.$invalid && this.$v.$dirty;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
    }
  }
};
</script>

<style scoped>
</style>