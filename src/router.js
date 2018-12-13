import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import store from "./store.js";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
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
    },
    {
      path: "/sandbox-3",
      name: "sandbox3",

      component: () =>
        import(/* webpackChunkName: "sandbox" */ "./views/Sandbox3.vue")
    },
    {
      path: "/sandbox-4",
      name: "sandbox4",

      component: () =>
        import(/* webpackChunkName: "sandbox" */ "./views/Sandbox4.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/forgot",
      name: "forgot",
      component: () =>
        import(/* webpackChunkName: "forgot" */ "./views/Forgot.vue")
    },
    {
      path: "/reset",
      name: "reset",
      component: () =>
        import(/* webpackChunkName: "reset" */ "./views/Reset.vue")
    },
    {
      path: "/404",
      name: "error",
      component: () => import(/* webpackChunkName: "error" */ "./views/404.vue")
    },
    {
      path: "*",
      redirect: { name: "error" }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let jwt = localStorage.getItem("jwt");
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn && jwt) {
      next();
      return;
    }
    store.dispatch("logout").then(router.push("/login"));
    next("/login");
  } else {
    next();
  }
});

export default router;
