const config = {
  app: {
    categories: [
      { name: "NOFO Release Date", color: "#0D47A1" },
      { name: "NOFO Close Date", color: "#9575CD" },
      { name: "Grant start dates", color: "#4DB6AC" },
      {
        name: "Federal application or award acceptance due date",
        color: "#1B5E20"
      },
      { name: "Federal reporting due dates", color: "#3E2723" },
      { name: "Budget Committee dates", color: "#90A4AE" },
      { name: "OFM Grantee Audits", color: "#C0CA33" },
      { name: "Site Visits", color: "#6A1B9A" },
      { name: "In House Meetings", color: "#F57F17" },
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
    excerptTruncate: 150,
    navTooltipOpenDelay: 800
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
    login: "/auth/local",
    timeout: "4000"
  }
};

export default config;
