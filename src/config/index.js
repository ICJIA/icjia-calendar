const config = {
  app: {
    categories: [
      { name: "NOFO release or close dates", color: "#0D47A1" },
      { name: "Grant start dates", color: "#4DB6AC" },
      { name: "Federal application due dates", color: "#1B5E20" },
      { name: "Federal reporting due dates", color: "#EC407A" },
      { name: "Budget Committee dates", color: "#4A148C" },
      { name: "OFM Grantee Audits", color: "#2962FF" },
      { name: "Site Visits", color: "#6A1B9A" },
      { name: "Out of Office", color: "#B71C1C" },
      { name: "ICJIA General", color: "#E91E63" }
    ],
    smtp: "https://mail.icjia.cloud/icjia-calendar",
    search: {
      shouldSort: true,
      threshold: 0.5,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["title", "description", "category", "start", "end"]
    },
    markdown: {
      html: true,
      linkify: true,
      typographer: true
    },
    excerptTruncate: 150
  },
  api: {
    base: "https://content.icjia-api.cloud",
    baseClient: "https://calendar.icjia.cloud",
    admin: "/admin",
    forgetPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    resetPasswordCallback: "/reset",
    events: "/events",
    register: "/auth/local/register",
    login: "/auth/local"
  }
};

export default config;
