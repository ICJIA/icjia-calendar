<template>
  <div>
    <div v-if="dayObj.year >=this.minYear && dayObj.year <= this.maxYear">
      <div class="pl-1 pt-2 pb-2 dayNumber">{{dayObj.day}}</div>
      <div v-if="!debug">
        <div style="min-height: 150px;">
          <div v-for="(event, index) in dayObj.dayEvents" :key="index">
            <div v-for="(isVisible, index) in visibleEvents" :key="index">
              <div v-if="event.color === isVisible">
                <v-tooltip top open-delay="50" max-width="400">
                  <div :style="eventStyle(event)" class="event" slot="activator">{{event.title}}</div>
                  <h2 style="text-transform: uppercase;">{{event.title}}</h2>
                  <div v-html="event.excerpt"></div>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="font-size: 12px">
        gridID: {{dayObj.gridID}}
        <br>
        dayOfYear: {{dayObj.dayOfYear}}
        <br>
        fullDate: {{dayObj.fullDate}}
        <br>
        # of events: {{dayObj.dayEvents.length}}
      </div>
    </div>
    <div v-else>
      <span style="width: 100% !important; background-color: #888"></span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

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
        return "white";
      }
    },
    fullDateFromDayOfYear(day) {
      return moment().dayOfYear(day);
    },

    eventStyle(event) {
      let marginLeft = "0px";
      let marginRight = "0px";

      return `background-color: ${
        event.color
      }; font-size: 11px; text-transform: uppercase; color: #fff; padding: 4px 4px; font-weight: bold; margin-bottom: 5px; margin-left: ${marginLeft}; margin-right: ${marginRight}`;
    }
  },
  computed: {
    debug() {
      return this.$store.getters.debug;
    },
    visibleEvents() {
      return this.$store.getters.visibleEvents;
    },
    minYear() {
      return this.$store.getters.minYear;
    },
    maxYear() {
      return this.$store.getters.maxYear;
    }
  },
  watch: {}
};
</script>

<style scoped>
.dayNumber {
  font-size: 18px;
}
</style>