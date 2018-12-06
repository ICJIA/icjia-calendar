import axios from "axios";

const apiClient = axios.create({
  baseURL: `https://calendar.icjia-api.cloud`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getEvents() {
    return apiClient.get("/events");
  }
};
