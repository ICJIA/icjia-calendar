import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    debug: false
  },
  mutations: {
    TOGGLE_DEBUG(state, debug) {
      state.debug = !debug;
    }
  },
  actions: {},
  getters: {
    debug: state => state.debug
  }
});
