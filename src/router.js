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
        requiresAuth: true,
        nav: {
          eventDrawer: true,
          categoryDrawer: true,
          refresh: true
        }
      }
    },

    {
      path: "/contact",
      name: "contact",

      component: () =>
        import(/* webpackChunkName: "contact" */ "./views/Contact.vue"),
      meta: {
        nav: {
          eventDrawer: false,
          categoryDrawer: false,
          refresh: false
        }
      }
    },

    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue"),
      meta: {
        nav: {
          eventDrawer: false,
          categoryDrawer: false,
          refresh: false
        }
      }
    },
    {
      path: "/forgot",
      name: "forgot",
      component: () =>
        import(/* webpackChunkName: "forgot" */ "./views/Forgot.vue"),
      meta: {
        nav: {
          eventDrawer: false,
          categoryDrawer: false,
          refresh: false
        }
      }
    },
    {
      path: "/reset",
      name: "reset",
      component: () =>
        import(/* webpackChunkName: "reset" */ "./views/Reset.vue"),
      meta: {
        nav: {
          eventDrawer: false,
          categoryDrawer: false,
          refresh: false
        }
      }
    },
    {
      path: "/register",
      name: "register",
      component: () =>
        import(/* webpackChunkName: "regsiter" */ "./views/Register.vue"),
      meta: {
        nav: {
          eventDrawer: false,
          categoryDrawer: false,
          refresh: false
        }
      }
    },

    {
      path: "/sandbox",
      name: "sandbox",
      component: () =>
        import(/* webpackChunkName: "sandbox" */ "./views/Sandbox.vue"),
      meta: {
        nav: {
          eventDrawer: true,
          categoryDrawer: true,
          refresh: false
        }
      }
    },
    {
      path: "/success",
      name: "success",
      component: () =>
        import(/* webpackChunkName: "success" */ "./views/Success.vue"),
      meta: {
        nav: {
          eventDrawer: false,
          categoryDrawer: false,
          refresh: false
        }
      }
    },
    {
      path: "/sandbox-2",
      name: "sandbox-2",
      component: () =>
        import(/* webpackChunkName: "sandbox" */ "./views/Sandbox2.vue"),
      meta: {
        nav: {
          eventDrawer: true,
          categoryDrawer: true,
          refresh: false
        }
      }
    },
    {
      path: "/404",
      name: "error",
      component: () =>
        import(/* webpackChunkName: "error" */ "./views/404.vue"),
      meta: {
        nav: {
          eventDrawer: false,
          categoryDrawer: false,
          refresh: false
        }
      }
    },
    {
      path: "*",
      redirect: { name: "error" }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
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
