<template>
  <div>
    <v-snackbar v-model="snackbarRefresh" :timeout="timeout" top color="success">Events refreshed
      <v-btn dark flat @click="snackbarRefresh = false">Close</v-btn>
    </v-snackbar>
    <v-navigation-drawer
      v-model="categoryDrawer"
      fixed
      app
      disable-resize-watcher
      width="250"
      style="background: #eee; z-index: 150"
    >
      <div class="text-xs-center pb-0 pt-3 mb-3">
        <v-btn depressed small @click="categoryDrawer=false">CLOSE
          <v-icon right dark>close</v-icon>
        </v-btn>
      </div>
      <list-categories></list-categories>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="eventDrawer"
      fixed
      app
      right
      disable-resize-watcher
      width="400"
      style="background: #eee; z-index: 150"
    >
      <div class="text-xs-center pb-0 pt-3 mb-3">
        <v-btn depressed small @click="eventDrawer=false">CLOSE
          <v-icon right dark>close</v-icon>
        </v-btn>
      </div>
      <list-events></list-events>
    </v-navigation-drawer>

    <v-toolbar dark fixed color="primary">
      <v-toolbar-side-icon
        @click.stop="categoryDrawer = !categoryDrawer"
        v-if="isLoggedIn && !hideCategoryDrawer"
      ></v-toolbar-side-icon>

      <v-toolbar-title class="white--text">
        <router-link to="/">
          <span style="font-weight: bold">ILLINOIS</span> |
          <span
            style="color: #ccc; text-transform: uppercase;"
          >Criminal Justice Information Authority</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="home" v-if="!isCondensed">
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn icon to="/search" v-if="!isCondensed && isLoggedIn">
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn icon @click="refresh" v-if="!isCondensed && isLoggedIn">
        <v-icon>refresh</v-icon>
      </v-btn>

      <v-menu offset-y dark nudge-left="100" transition="slide-x-transition" style="z-index: 150;">
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list dark>
          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>today</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/" class="link">Home</router-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>search</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/search" class="link">Search</router-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-divider class="mb-2 mt-2" v-if="this.$store.getters.isLoggedIn"></v-divider>

          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>add</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <a :href="getContentAdminURL" class="link" target="_blank">Add New Event</a>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="this.$store.getters.isLoggedIn" @click="refresh">
            <v-icon left>refresh</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>Refresh Events</v-list-tile-title>
          </v-list-tile>
          <v-divider class="mb-2 mt-2" v-if="this.$store.getters.isLoggedIn"></v-divider>
          <v-list-tile>
            <v-icon left>markunread</v-icon>&nbsp;&nbsp;
            <v-list-tile-title @click="closeEventDrawer">
              <router-link to="/contact" class="link">Contact Support</router-link>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile>
            <v-icon left>redo</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/forgot" class="link">Reset Password</router-link>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-icon left>lock_open</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/login" class="link">Log Out</router-link>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="this.$store.getters.isLoggedIn">
            <v-list-tile-title>
              <router-link to="/login" class="link">
                <span
                  v-if="!isCondensed"
                  style="color:#8C9EFF; font-size: 14px"
                >&nbsp;&nbsp;{{this.$store.state.userMeta.email}}</span>
              </router-link>
            </v-list-tile-title>
          </v-list-tile>

          <v-list-tile v-else>
            <v-icon left>lock</v-icon>&nbsp;&nbsp;
            <v-list-tile-title>
              <router-link to="/login" class="link">Log In</router-link>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-toolbar-side-icon
        @click.stop="eventDrawer = !eventDrawer"
        v-if="isLoggedIn && !hideEventDrawer"
      ></v-toolbar-side-icon>
    </v-toolbar>
  </div>
</template>
<script>
import { EventBus } from "@/event-bus.js";
import ListEvents from "@/components/ListEvents";
import ListCategories from "@/components/ListCategories";
import config from "@/config";
export default {
  components: {
    ListEvents,
    ListCategories
  },
  data() {
    return {
      snackbarRefresh: false,
      timeout: 2000
    };
  },
  methods: {
    home() {
      this.$router.push("/");
    },
    refresh() {
      this.$store
        .dispatch("getData")
        .then(response => this.$store.dispatch("structureData", response))
        .then(() => {
          this.snackbarRefresh = true;
          EventBus.$emit("refresh");
        })
        .catch(e => console.log(e));
    },
    closeEventDrawer() {
      this.$store.commit("CLOSE_EVENT_DRAWER");
    }
  },
  computed: {
    categoryDrawer: {
      get() {
        return this.$store.state.categoryDrawer;
      },
      set(val) {
        this.$store.commit("SET_CATEGORY_DRAWER", val);
      }
    },
    getContentAdminURL() {
      return config.api.base + config.api.admin;
    },
    eventDrawer: {
      get() {
        return this.$store.state.eventDrawer;
      },
      set(val) {
        this.$store.commit("SET_EVENT_DRAWER", val);
      }
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isCondensed() {
      if (
        this.$vuetify.breakpoint.name === "xs" ||
        this.$vuetify.breakpoint.name === "sm"
      ) {
        return true;
      } else {
        return false;
      }
    },
    hideCategoryDrawer() {
      return this.$route.meta.hideCategoryDrawer;
    },
    hideEventDrawer() {
      return this.$route.meta.hideEventDrawer;
    }
  }
};
</script>

<style scoped>
a {
  color: #fff;
  text-decoration: none;
}
</style>
