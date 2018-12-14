const config = {
  categories: [
    { name: "Out of Office", color: "#B71C1C" },
    {
      name: "Site Visits",
      color: "#6A1B9A"
    },
    { name: "NOFO release or close dates", color: "#0D47A1" },
    { name: "Grant start dates", color: "#4DB6AC" },
    { name: "Federal application due dates", color: "#1B5E20" },
    { name: "Federal reporting due dates", color: "#EC407A" },
    { name: "Budget Committee dates", color: "#4A148C" },
    { name: "OFM Grantee Audits", color: "#F8BBD0" }
  ],
  theme: {
    light: {
      isNotMonth: "#fff",
      isMonth: "#ccc",
      dateDigits: "#333",
      todayHighlight: "#999"
    },
    dark: {}
  },
  app: {
    minYear: 2000,
    maxYear: 2099
  },
  api: {
    base: "https://content.icjia-api.cloud",
    baseClient: "https://calendar.icjia.cloud",
    forgetPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    resetPasswordCallback: "/reset",
    events: "/events",
    login: "/auth/local"
  }
};

export default config;
