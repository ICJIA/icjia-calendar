import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    debug: false,
    eventColors: ["red", "gold", "green", "midnightblue", "blue"]
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
