<template>
  <div>
    <v-bottom-sheet v-model="sheet">
      <v-layout>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Lorem ipsum dolor sit amet</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et purus nec nunc vestibulum mattis nec quis quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam a sodales lacus, ac imperdiet orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sit amet lacus et elit pellentesque dignissim. Curabitur nec imperdiet dui, vel venenatis libero. Duis posuere diam in magna convallis, sit amet dictum nulla posuere. Nulla ut aliquet erat. Quisque eget convallis ex, et egestas augue. Donec sit amet velit sodales, tincidunt metus ac, posuere nulla. Quisque eu dolor sit amet ex viverra sagittis. Phasellus eget dolor enim. Duis ante ante, elementum nec sagittis quis, malesuada eget velit.
                Mauris sit amet vulputate sapien. Sed laoreet luctus dignissim. Sed sollicitudin, ligula et elementum accumsan, arcu felis placerat tellus, ac dapibus orci sapien porttitor lacus. Nulla fermentum tincidunt porta. Pellentesque tincidunt dui sit amet risus sollicitudin interdum in nec nisl. Donec aliquam nisi quis orci tincidunt viverra. Proin non maximus diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vitae pharetra massa. Mauris ac venenatis dui. Proin tellus tellus, lobortis vel eros a, semper interdum mauris. Aliquam erat volutpat. Donec eu lectus quis ligula scelerisque vehicula quis ultricies nunc. Vestibulum mi elit, faucibus non leo sed, volutpat iaculis tortor. Suspendisse pretium lacinia egestas.
              </p>
              <h2>Lorem ipsum dolor sit amet</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et purus nec nunc vestibulum mattis nec quis quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam a sodales lacus, ac imperdiet orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla sit amet lacus et elit pellentesque dignissim. Curabitur nec imperdiet dui, vel venenatis libero. Duis posuere diam in magna convallis, sit amet dictum nulla posuere. Nulla ut aliquet erat. Quisque eget convallis ex, et egestas augue. Donec sit amet velit sodales, tincidunt metus ac, posuere nulla. Quisque eu dolor sit amet ex viverra sagittis. Phasellus eget dolor enim. Duis ante ante, elementum nec sagittis quis, malesuada eget velit.
                Mauris sit amet vulputate sapien. Sed laoreet luctus dignissim. Sed sollicitudin, ligula et elementum accumsan, arcu felis placerat tellus, ac dapibus orci sapien porttitor lacus. Nulla fermentum tincidunt porta. Pellentesque tincidunt dui sit amet risus sollicitudin interdum in nec nisl. Donec aliquam nisi quis orci tincidunt viverra. Proin non maximus diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vitae pharetra massa. Mauris ac venenatis dui. Proin tellus tellus, lobortis vel eros a, semper interdum mauris. Aliquam erat volutpat. Donec eu lectus quis ligula scelerisque vehicula quis ultricies nunc. Vestibulum mi elit, faucibus non leo sed, volutpat iaculis tortor. Suspendisse pretium lacinia egestas.
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn flat color="orange" @click="sheet=false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-bottom-sheet>

    <li @click="getDayInfo(gridID)" class="grid">
      <span style="width: 100% !important;" :class="gridBackground()">
        <div>{{dayObj.day}}</div>

        <div
          v-for="(event, index) in dayObj.dayEvents"
          :key="index"
          :style="eventStyle(event)"
        >&nbsp;</div>

        <div v-if="debug" style="font-size: 10px;">{{dayObj}}</div>
      </span>
    </li>
  </div>
</template>

<script>
import { getDayMeta } from "@/utils";

export default {
  props: {
    gridID: {
      type: Number
    },
    dayObj: {
      type: Object
    }
  },
  data() {
    return {
      truncateAfter: 15,
      sheet: false,
      dayMeta: null,
      backgroundStyle: null,
      dayEvents: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    gridBackground() {
      if (this.dayObj.month - 1 === this.$store.state.currentMonth - 1) {
        return "white";
      } else {
        return "grey lighten-3";
      }
    },
    eventStyle(event) {
      let marginLeft = "0px";
      let marginRight = "0px";
      if (event.isStart) {
        marginLeft = "20px";
      }
      if (event.isFinish) {
        marginRight = "20px";
      }
      return `background-color: ${
        event.color
      }; height: 8px; margin-bottom: 2px; margin-left: ${marginLeft}; margin-right: ${marginRight}`;
    },

    getDayInfo(gridID) {
      let meta = getDayMeta(gridID, this.$store);
      this.$store.dispatch("setDayMeta", meta);
      this.$store.dispatch("setCurrentDay", meta.day);
      this.$store.dispatch("setCurrentMonth", meta.month);
      this.$store.dispatch("setCurrentYear", meta.year);
      let noEvents = [];
      if (this.apiData[meta.year][meta.dayOfYear]) {
        this.$store.dispatch(
          "setDayEvents",
          this.apiData[meta.year][meta.dayOfYear]
        );
      } else {
        this.$store.dispatch("setDayEvents", noEvents);
      }
      this.$store.commit("OPEN_EVENT_DRAWER");
    }
  },
  computed: {
    minYear() {
      return this.$store.getters.minYear;
    },
    maxYear() {
      return this.$store.getters.maxYear;
    },
    currentYear() {
      return this.$store.getters.currentYear;
    },
    currentMonth() {
      return this.$store.getters.currentMonth;
    },
    currentDay() {
      return this.$store.getters.currentDay;
    },
    calendarMeta() {
      return this.$store.getters.calendarMeta;
    },
    apiData() {
      return this.$store.getters.apiData;
    },
    debug() {
      return this.$store.getters.debug;
    }
  },
  watch: {}
};
</script>

<style scoped>
.event {
  margin-bottom: 5px !important;
  height: 8px !important;
}
.grid:hover {
  cursor: pointer;
}
</style>