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
    eventDrawer: true,
    visibleEvents: colors.map(x => x),
    appColors: colors.map(x => x),
    calendarMeta: [],
    currentMonth: null,
    currentYear: null,
    currentDay: null,
    minYear: null,
    maxYear: null,
    apiData: {},
    drawer: true,
    dayEvents: [],
    dayMeta: {}
  },
  mutations: {
    TOGGLE_DEBUG(state, debug) {
      state.debug = !debug;
    },
    OPEN_EVENT_DRAWER(state) {
      state.eventDrawer = true;
    },
    CLOSE_EVENT_DRAWER(state) {
      state.eventDrawer = false;
    },
    TOGGLE_EVENT_DRAWER(state) {
      state.eventDrawer = !state.eventDrawer;
    },
    TOGGLE_DRAWER(state, drawer) {
      state.debug = !drawer;
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
    SET_CURRENT_DAY(state, currentDay) {
      state.currentDay = currentDay;
    },
    SET_MIN_YEAR(state, minYear) {
      state.minYear = minYear;
    },
    SET_MAX_YEAR(state, maxYear) {
      state.maxYear = maxYear;
    },
    SET_API_DATA(state, data) {
      state.apiData = data;
    },
    SET_DAY_EVENTS(state, dayEvents) {
      state.dayEvents = dayEvents;
    },
    SET_DAY_META(state, dayMeta) {
      state.dayMeta = dayMeta;
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
    setCurrentDay({ commit }, setCurrentDay) {
      commit("SET_CURRENT_DAY", setCurrentDay);
    },
    setMinYear({ commit }, minYear) {
      commit("SET_MIN_YEAR", minYear);
    },
    setMaxYear({ commit }, maxYear) {
      commit("SET_MAX_YEAR", maxYear);
    },
    setApiData({ commit }, data) {
      commit("SET_API_DATA", data);
    },
    setDayEvents({ commit }, dayEvents) {
      commit("SET_DAY_EVENTS", dayEvents);
    },
    setDayMeta({ commit }, dayMeta) {
      commit("SET_DAY_META", dayMeta);
    }
  },
  getters: {
    debug: state => state.debug,
    calendarMeta: state => state.calendarMeta,
    visibleEvents: state => state.visibleEvents,
    currentYear: state => state.currentYear,
    currentMonth: state => state.currentMonth,
    currentDay: state => state.currentDay,
    appColors: state => state.appColors,
    minYear: state => state.minYear,
    maxYear: state => state.maxYear,
    apiData: state => state.apiData,
    drawer: state => state.drawer,
    dayEvents: state => state.dayEvents,
    dayMeta: state => state.dayMeta,
    eventDrawer: state => state.eventDrawer
  }
});
