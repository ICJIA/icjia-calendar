import Vue from "vue";
import Vuex from "vuex";
import config from "@/config";
import axios from "axios";
Vue.use(Vuex);

const colors = config.categories.map(cat => {
  return cat.color;
});

export default new Vuex.Store({
  state: {
    debug: false,
    eventDrawer: false,
    visibleEvents: colors.map(x => x),
    appColors: colors.map(x => x),
    calendarMeta: [],
    currentMonth: null,
    currentYear: null,
    currentDay: null,
    minYear: null,
    maxYear: null,
    apiData: {},
    drawer: false,
    dayEvents: [],
    dayMeta: {},
    isLoading: false,
    status: "",
    jwt: localStorage.getItem("jwt") || "",
    userMeta: JSON.parse(localStorage.getItem("userMeta")) || "",
    user: {}
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
    CLOSE_CATEGORY_DRAWER(state) {
      state.drawer = false;
    },
    SET_CALENDAR_META(state, calendarMeta) {
      state.calendarMeta = calendarMeta;
    },
    START_LOADER(state) {
      state.isLoading = true;
    },
    STOP_LOADER(state) {
      state.isLoading = false;
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
    },
    auth_request(state) {
      state.status = "<img src='/loading.gif' />";
    },
    auth_success(state, payload) {
      state.status = "<img src='/loading.gif' />";
      state.jwt = payload.jwt;
      state.userMeta = payload.userMeta;
    },
    auth_reset(state, message) {
      state.status = message;
    },

    auth_error(state, err) {
      state.status = `<div style='color: red'>${err}</div>`;
    },
    CLEAR_STATUS(state) {
      state.status = ``;
    },
    logout(state) {
      state.status = "";
      state.jwt = "";
      state.user = {};
      state.userMeta = "";
      state.apiData = {};
      state.dayMeta = {};
      state.dayEvents = [];
      state.currentDay = null;
      state.currentMonth = null;
      state.currentYear = null;
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
      commit("SET_CURRENT_YEAR", parseInt(currentYear));
    },
    setCurrentMonth({ commit }, currentMonth) {
      commit("SET_CURRENT_MONTH", parseInt(currentMonth));
    },
    setCurrentDay({ commit }, setCurrentDay) {
      commit("SET_CURRENT_DAY", parseInt(setCurrentDay));
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
    },
    startLoader({ commit }) {
      commit("START_LOADER");
    },
    stopLoader({ commit }) {
      commit("STOP_LOADER");
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        commit("CLOSE_EVENT_DRAWER");
        commit("CLOSE_CATEGORY_DRAWER");
        localStorage.removeItem("jwt");
        localStorage.removeItem("userMeta");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    reset({ commit }, payload) {
      commit("CLEAR_STATUS");
      return new Promise((resolve, reject) => {
        commit("CLEAR_STATUS");
        axios({
          url: `${config.api.base}${config.api.resetPassword}`,
          data: payload,
          method: "POST"
        })
          .then(resp => {
            commit(
              "auth_reset",
              `<div style="color: green">Success! You've reset your password.</div>`
            );
            commit("logout");
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            delete axios.defaults.headers.common["Authorization"];
            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);
            let message = JSON.parse(JSON.stringify(err.response.data.message));

            commit(
              "auth_error",
              `<h3>ERROR:</h3>${message}<div>Your password was not reset.</div>`
            );

            reject(err);
          });
      });
    },
    forgot({ commit }, email) {
      commit("CLEAR_STATUS");
      return new Promise((resolve, reject) => {
        commit("auth_request");

        let data = {};
        data.email = email;
        data.url = `${config.api.baseClient}${
          config.api.resetPasswordCallback
        }`;

        axios({
          url: `${config.api.base}${config.api.forgetPassword}`,
          data: data,
          method: "POST"
        })
          .then(resp => {
            commit(
              "auth_reset",
              `<div style="color: green"><h3>Success!</h3><div>Please check your email for your reset link.</div></div>`
            );

            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);

            let message = JSON.parse(JSON.stringify(err.response.data.message));
            commit("auth_error", `<h3>ERROR:</h3>${message}`);
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            reject(err);
          });
      });
    },
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: `${config.api.base}${config.api.login}`,
          data: payload,
          method: "POST"
        })
          .then(resp => {
            const jwt = resp.data.jwt;
            const userMeta = resp.data.user;
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("userMeta", JSON.stringify(userMeta));
            axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
            commit("auth_success", { jwt, userMeta });
            resolve(resp);
          })
          .catch(err => {
            console.log("error");
            let message = JSON.parse(JSON.stringify(err.response.data.message));
            commit("auth_error", message);
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            reject(err);
          });
      });
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
    eventDrawer: state => state.eventDrawer,
    isLoading: state => state.isLoading,
    isLoggedIn: state => !!state.jwt,
    authStatus: state => state.status,
    userMeta: state => state.userMeta
  }
});
