<template>
  <div>
    <v-layout row wrap class="mb-0">
      <v-flex xs12>
        <header class="pl-3 mb-2 mt-1" style>
          <v-btn fab dark small color="grey" @click="getPreviousMonth()">
            <v-icon dark>arrow_back_ios</v-icon>
          </v-btn>
          <v-btn fab dark small color="grey" @click="getNextMonth()">
            <v-icon dark>arrow_forward_ios</v-icon>
          </v-btn>&nbsp;&nbsp;
          <h2 style="font-weight: 900">{{currentDate}}</h2>&nbsp;
          &nbsp;&nbsp;
          <v-spacer></v-spacer>
          <v-btn dark @click="today" style="color: #eee !important">TODAY</v-btn>&nbsp;
        </header>
      </v-flex>
      <v-flex xs12>
        <div class="name-container">
          <div class="name-element">Sunday</div>
          <div class="name-element">Monday</div>
          <div class="name-element">Tuesday</div>
          <div class="name-element">Wednesday</div>
          <div class="name-element">Thursday</div>
          <div class="name-element">Friday</div>
          <div class="name-element">Saturday</div>
        </div>
        <div class="grid-container grid-container">
          <div v-for="i in gridSize" :key="`1${i}`">
            <!-- <div class="grid-element"> -->
            <day-maker :gridID="i" :dayObj="generateDayMeta(i)"/>
            <!-- </div> -->
          </div>
        </div>
      </v-flex>
    </v-layout>
    <div v-if="this.$store.state.debug">
      <v-layout row wrap class="pl-5 pr-5">
        <v-flex xs12>
          <div>
            <h2
              style="border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 15px;"
            >Debug:</h2>
            <h4>api:</h4>

            <div>
              <tree-view :data="$store.getters.apiData" :options="{maxDepth: 3}"></tree-view>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import DayMaker from "@/components/DayMaker";
import { getDayMeta } from "@/utils";
import moment from "moment";
export default {
  data() {
    return {};
  },
  components: {
    DayMaker
  },
  methods: {
    generateDayMeta(gridID) {
      return getDayMeta(gridID, this.$store);
    },
    gridBackground() {
      if (this.dayObj.month - 1 === this.$store.state.currentMonth - 1) {
        return "white";
      } else {
        return "grey lighten-3";
      }
    },
    getNextMonth() {
      if (this.currentMonth === 12 && this.currentYear === this.maxYear) {
        this.$store.dispatch("setCurrentMonth", 12);
        this.$store.dispatch("setCurrentYear", this.$store.state.maxYear);
      } else if (this.currentMonth === 12) {
        this.$store.dispatch("setCurrentMonth", 1);
        this.$store.dispatch(
          "setCurrentYear",
          this.$store.state.currentYear + 1
        );
      } else {
        this.$store.dispatch(
          "setCurrentMonth",
          this.$store.state.currentMonth + 1
        );
      }
    },
    getPreviousMonth() {
      if (this.currentMonth === 1 && this.currentYear === this.minYear) {
        this.$store.dispatch("setCurrentMonth", 1);
        this.$store.dispatch("setCurrentYear", this.$store.state.minYear);
      } else if (this.currentMonth === 1) {
        this.$store.dispatch("setCurrentMonth", 12);
        this.$store.dispatch(
          "setCurrentYear",
          this.$store.state.currentYear - 1
        );
      } else {
        this.$store.dispatch(
          "setCurrentMonth",
          this.$store.state.currentMonth - 1
        );
      }
    },
    today() {
      this.$store.dispatch("setCurrentMonth", new Date().getMonth() + 1);
      this.$store.dispatch("setCurrentYear", new Date().getFullYear());
      this.$store.dispatch("setCurrentDay", new Date().getUTCDate());
      this.now = moment().format("MMMM DD, YYYY");
      let gridID =
        this.calendarMeta[this.currentYear][this.currentMonth - 1]
          .startDayOfWeek + this.currentDay;

      let meta = getDayMeta(gridID, this.$store);
      this.$store.dispatch("setDayMeta", meta);

      let noEvents = [];
      if (this.apiData[meta.year][meta.dayOfYear]) {
        this.$store.dispatch(
          "setDayEvents",
          this.apiData[meta.year][meta.dayOfYear]
        );
        this.$store.commit("TOGGLE_EVENT_DRAWER");
      } else {
        this.$store.dispatch("setDayEvents", noEvents);
        this.$store.commit("TOGGLE_EVENT_DRAWER");
      }
    }
  },
  computed: {
    currentDate() {
      let date = new Date(this.currentYear, this.currentMonth - 1);
      return moment(date).format("MMMM YYYY");
    },
    gridSize() {
      return this.calendarMeta[this.currentYear][this.currentMonth - 1]
        .gridSize;
    },
    minYear() {
      return this.$store.getters.minYear;
    },
    maxYear() {
      return this.$store.getters.maxYear;
    },
    currentYear() {
      return this.$store.getters.currentYear;
    },
    currentDay() {
      return this.$store.getters.currentDay;
    },
    currentMonth() {
      return this.$store.getters.currentMonth;
    },
    calendarMeta() {
      return this.$store.getters.calendarMeta;
    },
    eventData() {
      return this.$store.getters.data;
    },
    apiData() {
      return this.$store.getters.apiData;
    },
    isLoading() {
      return this.$store.getters.isLoading;
    }
  }
};
</script>

<style scoped>
.name-container {
  display: grid;
  grid-gap: 2px;
  grid-template-columns: repeat(7, minmax(50px, 1fr));
  grid-auto-rows: minmax(10px, auto) !important;
}
.name-element {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  color: #333;
  font-weight: bold;
  min-height: 10px;
  background-color: #aaa;
}
.grid-container {
  display: grid;
  grid-gap: 2px;
}

.grid-container {
  grid-template-columns: repeat(7, minmax(50px, 1fr));
}

header {
  padding: 0;
  margin: 0;
  background: #696969 !important;
}
</style>