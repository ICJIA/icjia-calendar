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
    <li v-html="createDay(gridID)" @click="getDayInfo(gridID)"></li>
  </div>
</template>

<script>
import { stringTruncate, getDayMeta } from "@/utils";
import { EventBus } from "../event-bus.js";
export default {
  props: {
    gridID: {
      type: Number
    }
  },
  data() {
    return {
      truncateAfter: 15,
      sheet: false,
      dayMeta: null
    };
  },
  created() {},
  mounted() {
    // EventBus.$on("setTodayEvents", () => {});
  },
  methods: {
    createDay(gridID) {
      let dayMeta = getDayMeta(gridID, this.$store);
      let html = this.getDayHTML(dayMeta);
      return html;
    },

    getDayHTML(dayObj) {
      let truncateAfter = 15;
      let store = this.$store;
      let eventData = store.state.apiData;
      let year = store.state.currentYear;
      let backgroundStyle;
      if (dayObj.month - 1 === store.state.currentMonth - 1) {
        backgroundStyle = "background-color: #fff ; width: 100%; color: #333 ;";
      } else {
        backgroundStyle = "background-color: #eee ; width: 100%; color: #aaa ";
      }

      // if (moment().dayOfYear() === dayObj.dayOfYear) {
      //   backgroundStyle = "background-color: #999; width: 100%; color: #000 ";
      // }

      let dayEvents = "";
      if (eventData[year]) {
        if (eventData[year][dayObj.dayOfYear]) {
          dayEvents = eventData[year][dayObj.dayOfYear];
        }
      }
      let html = `<span style="${backgroundStyle}; ">${dayObj.day}`;
      if (dayEvents) {
        dayEvents.forEach(x => {
          /* eslint-disable no-unused-vars */
          let strLength;
          /* eslint-enable no-unused-vars */
          let text, filler, marginLeft, marginRight;
          if (store.state.visibleEvents.includes(x.color)) {
            if (x.isStart) {
              text = stringTruncate(x.description, truncateAfter);
              marginLeft = "15px";
            } else {
              strLength = x.description.strLength;
              filler = `&nbsp`;
              text = filler.repeat(truncateAfter);
              marginLeft = "0px";
            }

            if (x.isFinish) {
              marginRight = "15px";
            } else {
              marginRight = "0px";
            }

            html =
              html +
              `<div style="font-size: 12px; background: ${
                x.color
              }; color: #fff; margin-bottom: 2px; font-size: 8px; padding: 2px; font-weight: 900; text-transform: uppercase; margin-left: ${marginLeft};margin-right: ${marginRight};" class="event">${text}</div>`;
          }
        });
      }

      if (store.state.debug) {
        html =
          html +
          `<div style="font-weight: bold; font-size: 10px !important;">
        <div >DayOfYear: ${dayObj.dayOfYear}</div>
        <div >gridID: ${
          dayObj.gridID
        }</div><div>DateFromDayOfYear:<br><span class="pl-3">${
            dayObj.fullDate
          }</span> </div><div >Year: ${dayObj.year}</div></div>`;
      }
      html = html + `</span>`;

      return html;
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
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>