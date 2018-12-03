import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const colors = [
  "firebrick",
  "orange",
  "mediumseagreen",
  "royalblue",
  "darkslategray"
];

export default new Vuex.Store({
  state: {
    debug: false,
    visibleEvents: colors.map(x => x),
    appColors: colors.map(x => x),
    calendarMeta: [],
    currentMonth: null,
    currentYear: null,
    minYear: null,
    maxYear: null,
    apiData: {}
  },
  mutations: {
    TOGGLE_DEBUG(state, debug) {
      state.debug = !debug;
    },
    SET_CALENDAR_META(state, calendarMeta) {
      state.calendarMeta = calendarMeta;
    },

    SET_VISIBLE_EVENTS(state, visibleEvents) {
      state.visibleEvents = visibleEvents;
    },
    SET_CURRENT_YEAR(state, currentYear) {
      state.currentYear = currentYear;
    },
    SET_CURRENT_MONTH(state, currentMonth) {
      state.currentMonth = currentMonth;
    },
    SET_MIN_YEAR(state, minYear) {
      state.minYear = minYear;
    },
    SET_MAX_YEAR(state, maxYear) {
      state.maxYear = maxYear;
    },
    SET_API_DATA(state, data) {
      state.apiData = data;
    }
  },
  actions: {
    setCalendarMeta({ commit }, calendarMeta) {
      commit("SET_CALENDAR_META", calendarMeta);
    },

    setVisibleEvents({ commit }, events) {
      commit("SET_VISIBLE_EVENTS", events);
    },
    setCurrentYear({ commit }, currentYear) {
      commit("SET_CURRENT_YEAR", currentYear);
    },
    setCurrentMonth({ commit }, currentMonth) {
      commit("SET_CURRENT_MONTH", currentMonth);
    },
    setMinYear({ commit }, minYear) {
      commit("SET_MIN_YEAR", minYear);
    },
    setMaxYear({ commit }, maxYear) {
      commit("SET_MAX_YEAR", maxYear);
    },
    setApiData({ commit }, data) {
      commit("SET_API_DATA", data);
    }
  },
  getters: {
    debug: state => state.debug,
    calendarMeta: state => state.calendarMeta,
    visibleEvents: state => state.visibleEvents,
    currentYear: state => state.currentYear,
    currentMonth: state => state.currentMonth,
    appColors: state => state.appColors,
    minYear: state => state.minYear,
    maxYear: state => state.maxYear,
    apiData: state => state.apiData
  }
});
