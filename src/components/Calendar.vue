<template>
  <div>
    <div>
      <nav-calendar></nav-calendar>
      <div>
        <div class="name-container" v-if="!isCondensed">
          <div class="name-element">Sunday</div>
          <div class="name-element">Monday</div>
          <div class="name-element">Tuesday</div>
          <div class="name-element">Wednesday</div>
          <div class="name-element">Thursday</div>
          <div class="name-element">Friday</div>
          <div class="name-element">Saturday</div>
        </div>
      </div>

      <div class="wrapper with-height">
        <day
          :gridID="i-1"
          :calendarMeta="calendarMeta"
          v-for="(i, index) in calendarMeta.gridSize"
          :key="`${index}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import NavCalendar from "@/components/NavCalendar";
import Day from "@/components/Day";

export default {
  components: {
    NavCalendar,
    Day
  },
  methods: {
    selectDay() {
      console.log("click");
    }
  },
  computed: {
    // errorMessage() {
    //   let message = this.$store.state.error;

    //   return JSON.parse(JSON.stringify(message.response.message));
    // },
    breakpoint() {
      return this.$vuetify.breakpoint;
    },
    isCondensed() {
      if (this.breakpoint.name === "xs" || this.breakpoint.name === "sm") {
        return true;
      } else {
        return false;
      }
    },

    calendarMeta() {
      let obj = {};
      let gridSize;
      // eslint-disable-next-line
      let year;

      obj.startOfMonth = moment(this.$store.state.selectedDate)
        .utc()
        .startOf("month");

      year = moment(this.$store.state.selectedDate)
        .utc()
        .format("YYYY");

      obj.dayNumber = moment.utc(obj.startOfMonth).dayOfYear();
      obj.startDayOfWeek = moment.utc(obj.startOfMonth).day();
      if (obj.startDayOfWeek > 4) {
        gridSize = 42;
      } else {
        gridSize = 35;
      }
      obj.gridSize = gridSize;
      obj.gridFirst = obj.startOfMonth.subtract(obj.startDayOfWeek, "days");

      return obj;
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  display: grid;
  grid-gap: 2px;
  grid-template-columns: repeat(7, minmax(50px, 1fr));
  border-right: 1px solid #999;
  border-left: 1px solid #999;
}

.name-container {
  display: grid;
  grid-gap: 2px;
  grid-template-columns: repeat(7, minmax(50px, 1fr));
  grid-auto-rows: minmax(10px, auto) !important;
  margin-top: 125px;
  border-right: 1px solid #999;
  border-left: 1px solid #999;
  border-top: 1px solid #999;
}
.name-element {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  color: #fff;
  font-weight: bold;
  min-height: 10px;
  background-color: #aaa;
}
/* @media only screen and (max-width: 600px) {
  .wrapper {
    grid-template-columns: repeat(1, minmax(50px, 1fr));
  }
} */
.today {
  border: 0px solid #ddd !important;
  background-color: #eee !important;
}
@media only screen and (max-width: 960px) {
  .wrapper {
    grid-template-columns: repeat(1, minmax(50px, 1fr));
    grid-gap: 5px;
    margin-top: 120px;
  }
}
</style>
