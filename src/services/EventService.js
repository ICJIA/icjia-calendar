import axios from "axios";
import { config } from "@/config";

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
    console.log("fetching from api...");
    return apiClient.get(config.app.eventsRoute);
  }
};
