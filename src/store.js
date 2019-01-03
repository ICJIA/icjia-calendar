import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
Vue.use(Vuex);
import config from "@/config";
import axios from "axios";
import _ from "lodash";

const colors = config.app.categories.map(cat => {
  return cat.color;
});

const $http = axios.create({
  baseURL: `${config.api.base}`,
  timeout: 2000
});

$http.interceptors.response.use(undefined, function(err) {
  console.log(err);
  return new Promise(function(resolve) {
    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
      this.$store.dispatch("logout");
      resolve();
    }
    throw err;
  });
});

const stringTruncate = function(str, length) {
  let dots = str.length > length ? "..." : "";
  return str.substring(0, length) + dots;
};

export default new Vuex.Store({
  state: {
    events: null,
    data: null,
    eventDrawer: false,
    categoryDrawer: false,
    selectedDate: moment()
      .startOf("day")
      .format(),
    currentDate: moment()
      .startOf("day")
      .format(),
    isLoading: false,
    error: null,
    initialized: false,
    jwt: localStorage.getItem("jwt") || "",
    userMeta: JSON.parse(localStorage.getItem("userMeta")) || "",
    status: "",
    isLoggedIn: false,
    visibleEvents: colors.map(x => x),
    appColors: colors.map(x => x),
    debug: false,
    transitionToggle: false,
    condensedCalendarView: false
  },
  mutations: {
    SET_DATA(state, data) {
      state.data = data;
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_VISIBLE_EVENTS(state, visibleEvents) {
      state.visibleEvents = visibleEvents;
    },
    SET_SELECTED_DATE(state, date) {
      state.selectedDate = date;
    },
    SET_CURRENT_DATE(state, date) {
      state.currentDate = date;
    },
    INCREMENT_MONTH(state) {
      state.selectedDate = moment(state.selectedDate)
        .utc()
        .add(1, "M");
    },
    DECREMENT_MONTH(state) {
      state.selectedDate = moment(state.selectedDate)
        .utc()
        .subtract(1, "M");
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
    SET_EVENT_DRAWER(state, val) {
      state.eventDrawer = val;
    },
    OPEN_CATEGORY_DRAWER(state) {
      state.categoryDrawer = true;
    },
    CLOSE_CATEGORY_DRAWER(state) {
      state.categoryDrawer = false;
    },
    TOGGLE_CATEGORY_DRAWER(state) {
      state.categoryDrawer = !state.categoryDrawer;
    },
    SET_CATEGORY_DRAWER(state, val) {
      state.categoryDrawer = val;
    },
    START_LOADER(state) {
      state.isLoading = true;
    },
    STOP_LOADER(state) {
      state.isLoading = false;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_INITIALIZED(state, boolean) {
      state.initialized = boolean;
    },
    AUTH_SUCCESS(state, payload) {
      state.status = "Success!";
      state.jwt = payload.jwt;
      state.userMeta = payload.userMeta;
    },
    AUTH_RESET(state, message) {
      state.status = message;
    },
    AUTH_REGISTER(state, message) {
      state.status = message;
    },
    AUTH_ERROR(state, err) {
      state.status = `${err}`;
    },
    API_ERROR(state, err) {
      state.error = `${err}`;
    },
    TOGGLE_DEBUG(state, debug) {
      state.debug = !debug;
    },
    TOGGLE_CONDENSED_CALENDAR_VIEW(state) {
      state.condensedCalendarView = !state.condensedCalendarView;
    },
    CLEAR_STATUS(state) {
      state.status = ``;
    },
    LOGOUT(state) {
      state.status = "";
      state.jwt = "";
      state.error = null;
      state.user = {};
      state.userMeta = "";
      state.data = null;
      state.events = null;
      state.initialized = false;
      state.selectedDate = moment()
        .startOf("day")
        .format();
      state.currentDate = moment()
        .startOf("day")
        .format();
    },
    SET_TRANSITION_TOGGLE(state) {
      state.transitionToggle = !state.transitionToggle;
    }
  },
  actions: {
    setData({ commit }, data) {
      commit("SET_DATA", data);
    },
    setEvents({ commit }, events) {
      commit("SET_EVENTS", events);
    },
    setVisibleEvents({ commit }, events) {
      commit("SET_VISIBLE_EVENTS", events);
    },
    setSelectedDate({ commit }, date) {
      commit("SET_SELECTED_DATE", date);
    },
    setCurrentDate({ commit }, date) {
      commit("SET_CURRENT_DATE", date);
    },
    startLoader({ commit }) {
      commit("START_LOADER");
    },
    stopLoader({ commit }) {
      commit("STOP_LOADER");
    },
    getData({ commit }) {
      return new Promise((resolve, reject) => {
        const jwt = localStorage.getItem("jwt");

        if (jwt) {
          $http.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
          console.log("jwt token added to header");
        }
        commit("START_LOADER");

        $http
          .get(`${config.api.events}`)
          .then(resp => {
            commit("STOP_LOADER");
            commit("SET_DATA", resp);
            commit("SET_ERROR", null);
            resolve(resp);
          })
          .catch(err => {
            commit("STOP_LOADER");
            let error = {};
            error.type = "network";
            error.response = err;
            commit("SET_ERROR", error);

            reject(err);
          });
      });
    },
    structureData({ commit }, payload) {
      return new Promise((resolve, reject) => {
        try {
          let events = {};
          payload.data.forEach(e => {
            let eventObj = {};
            let start, end, duration, dayOfYear;
            if (!e.end) {
              e.end = e.start;
            }
            start = moment.utc(e.start);
            end = moment.utc(e.end);
            if (start > end) {
              duration = start.diff(end, "days");
            } else {
              duration = end.diff(start, "days");
            }
            eventObj.title = e.title.trim();
            if (start > end) {
              eventObj.start = e.end;
              eventObj.end = e.start;
            } else {
              eventObj.start = e.start;
              eventObj.end = e.end;
            }
            eventObj.duration = duration;
            eventObj.description = e.description;
            eventObj.excerpt = stringTruncate(
              e.description,
              config.app.excerptTruncate
            );
            let colorIndex = _.findIndex(config.app.categories, {
              name: e.category.trim()
            });
            try {
              eventObj.color = config.app.categories[colorIndex].color;
            } catch {
              eventObj.color = "gray";
            }
            eventObj.category = e.category.trim();
            eventObj.createdAt = e.createdAt;
            eventObj.updatedAt = e.updatedAt;
            if (start > end) {
              dayOfYear = moment.utc(e.end).dayOfYear();
              eventObj.year = moment.utc(e.end).year();
            } else {
              dayOfYear = moment.utc(e.start).dayOfYear();
              eventObj.year = moment.utc(e.start).year();
            }
            if (!_.has(events, start.format("YYYY"))) {
              events[eventObj.year] = {};
            }
            if (!_.has(events[start.format("YYYY")], dayOfYear)) {
              events[start.format("YYYY")][dayOfYear] = [];
            }
            events[start.format("YYYY")][dayOfYear].push(eventObj);
            if (duration > 0) {
              for (let d = 0; d < duration; d++) {
                let workingDate;
                if (start > end) {
                  workingDate = end.add(1, "days");
                } else {
                  workingDate = start.add(1, "days");
                }
                let dayOfYear = moment.utc(workingDate).dayOfYear();
                eventObj.duration = duration + 1;
                eventObj.year = moment.utc(workingDate).format("YYYY");
                if (!_.has(events, eventObj.year)) {
                  events[eventObj.year] = {};
                }
                if (!_.has(events[eventObj.year], dayOfYear)) {
                  events[eventObj.year][dayOfYear] = [];
                }
                events[eventObj.year][dayOfYear].push(eventObj);
              }
            }
          });
          commit("SET_EVENTS", events);
          commit("SET_INITIALIZED", true);
          resolve("Success.");
        } catch (err) {
          let error = {};
          error.type = "structure";
          error.response = err;
          commit("SET_ERROR", error);
          commit("SET_INITIALIZED", false);
          reject(err);
        }
      });
    },
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("START_LOADER");

        $http({
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
            commit("AUTH_SUCCESS", { jwt, userMeta });
            commit("STOP_LOADER");
            resolve(resp);
          })
          .catch(err => {
            let message;
            console.log("error", err);
            try {
              message = JSON.parse(JSON.stringify(err.response.data.message));
            } catch {
              message = "NETWORK ERROR: Please try again.";
            }
            commit("AUTH_ERROR", message);
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            commit("STOP_LOADER");
            commit("SET_ERROR", err);
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          commit("LOGOUT");
          commit("CLOSE_EVENT_DRAWER");
          commit("CLOSE_CATEGORY_DRAWER");
          localStorage.removeItem("jwt");
          localStorage.removeItem("userMeta");
          delete axios.defaults.headers.common["Authorization"];
          resolve();
        } catch (err) {
          reject(err);
          console.log(err);
        }
      });
    },
    register({ commit }, payload) {
      commit("CLEAR_STATUS");
      commit("CLOSE_EVENT_DRAWER");
      commit("CLOSE_CATEGORY_DRAWER");

      return new Promise((resolve, reject) => {
        $http({
          url: `${config.api.base}${config.api.register}`,
          data: payload,
          method: "POST"
        })
          .then(() => {
            commit(
              "AUTH_REGISTER",
              `Success! Please check your email for your verification link.`
            );

            resolve();
          })
          .catch(err => {
            console.log("Register error: ", JSON.stringify(err));
            let message;
            try {
              message = JSON.parse(JSON.stringify(err.response.data.message));
            } catch {
              message = "NETWORK ERROR: Cannot access the API";
            }
            commit("SET_ERROR", true);
            commit("AUTH_ERROR", `ERROR: ${message}`);

            reject(err);
          });
      });
    },
    forgot({ commit }, email) {
      commit("CLEAR_STATUS");
      commit("CLOSE_EVENT_DRAWER");
      commit("CLOSE_CATEGORY_DRAWER");
      return new Promise((resolve, reject) => {
        commit("START_LOADER");
        let data = {};
        data.email = email;
        data.url = `${config.api.baseClient}${
          config.api.resetPasswordCallback
        }`;

        $http({
          url: `${config.api.base}${config.api.forgetPassword}`,
          data: data,
          method: "POST"
        })
          .then(resp => {
            commit(
              "AUTH_RESET",
              `Success! Please check your email for your reset link.`
            );
            commit("STOP_LOADER");
            commit("SET_ERROR", false);
            resolve(resp);
          })
          .catch(err => {
            let message;
            try {
              message = JSON.parse(JSON.stringify(err.response.data.message));
            } catch {
              message = "NETWORK ERROR: Please try again.";
            }
            commit("SET_ERROR", true);
            commit("AUTH_ERROR", `ERROR: ${message}`);
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            commit("STOP_LOADER");
            reject(err);
          });
      });
    },
    reset({ commit }, payload) {
      commit("CLEAR_STATUS");
      return new Promise((resolve, reject) => {
        commit("CLEAR_STATUS");
        $http({
          url: `${config.api.base}${config.api.resetPassword}`,
          data: payload,
          method: "POST"
        })
          .then(resp => {
            commit("AUTH_RESET", `Success! You've reset your password.`);
            commit("SET_ERROR", false);
            commit("LOGOUT");
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            delete axios.defaults.headers.common["Authorization"];
            commit("STOP_LOADER");
            commit("SET_ERROR", false);
            resolve(resp);
          })
          .catch(err => {
            let message;
            try {
              message = JSON.parse(JSON.stringify(err.response.data.message));
            } catch {
              message = "NETWORK ERROR: Cannot access the API";
            }
            commit("STOP_LOADER");
            commit("SET_ERROR", true);
            commit("AUTH_ERROR", `ERROR: ${message}`);
            reject(err);
          });
      });
    }
  },
  getters: {
    isLoggedIn: state => !!state.jwt,
    isLoading: state => state.isLoading,
    userMeta: state => state.userMeta,
    visibleEvents: state => state.visibleEvents,
    appColors: state => state.appColors,
    debug: state => state.debug,
    condensedCalendarView: state => state.condensedCalendarView
  }
});
