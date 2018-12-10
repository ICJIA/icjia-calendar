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

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// router.beforeEach((routeTo, routeFrom, next) => {
//   vm.$store.dispatch("startLoader");
//   next();
// });
// router.afterEach(() => {
//   vm.$store.dispatch("stopLoader");
// });
