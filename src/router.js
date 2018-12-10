import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/sandbox",
      name: "sandbox",

      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Sandbox.vue")
    },
    {
      path: "/contact",
      name: "contact",

      component: () =>
        import(/* webpackChunkName: "contact" */ "./views/Contact.vue")
    },
    {
      path: "/sandbox-2",
      name: "sandbox2",

      component: () =>
        import(/* webpackChunkName: "sandbox" */ "./views/Sandbox2.vue")
    }
  ]
});

export default router;
