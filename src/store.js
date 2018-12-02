import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    debug: false,
    eventColors: [
      "firebrick",
      "orange",
      "mediumseagreen",
      "royalblue",
      "darkslategray"
    ],
    calendarMeta: []
  },
  mutations: {
    TOGGLE_DEBUG(state, debug) {
      state.debug = !debug;
    },
    SET_CALENDAR_META(state, calendarMeta) {
      state.calendarMeta = calendarMeta;
    }
  },
  actions: {
    setCalendarMeta({ commit, state }, calendarMeta) {
      commit("SET_CALENDAR_META", calendarMeta);
    }
  },
  getters: {
    debug: state => state.debug,
    calendarMeta: state => state.calendarMeta
  }
});
