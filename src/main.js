import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import browserDetect from "vue-browser-detect-plugin";
Vue.use(browserDetect);

import TreeView from "vue-json-tree-view";
Vue.use(TreeView);

Vue.config.productionTip = false;

import axios from "axios";

Vue.prototype.$http = axios;
const jwt = localStorage.getItem("jwt");

if (jwt) {
  Vue.prototype.$http.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${jwt}`;
  console.log("jwt token added to header");
}

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
