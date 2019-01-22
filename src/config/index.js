const config = {
  app: {
    categories: [
      {
        name: "NOFO Release Date",
        color: "#0D47A1",
        slug: "nofo-release-date"
      },
      { name: "NOFO Close Date", color: "#9575CD", slug: "nofo-close-date" },
      {
        name: "Grant start dates",
        color: "#4DB6AC",
        slug: "grant-start-dates"
      },
      {
        name: "Federal application or award acceptance due date",
        color: "#1B5E20",
        slug: "federal-application-or-award-acceptance-due-date"
      },
      {
        name: "Federal reporting due dates",
        color: "#3E2723",
        slug: "federal-reporting-due-dates"
      },
      {
        name: "Budget Committee dates",
        color: "#90A4AE",
        slug: "federal-application-or-award-acceptance-due-date"
      },
      {
        name: "OFM Grantee Audits",
        color: "#C0CA33",
        slug: "ofm-grantee-audits"
      },
      {
        name: "Site Visits",
        color: "#6A1B9A",
        slug: "site-visits"
      },
      {
        name: "In House Meetings",
        color: "#F57F17",
        slug: "in-house-meetings"
      },
      {
        name: "ICJIA General",
        color: "#E91E63",
        slug: "icjia-general"
      }
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
    timeout: "5000"
  }
};

export default config;
