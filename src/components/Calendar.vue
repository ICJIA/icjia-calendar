<template>
  <div>
    <div class="calendar mb-5">
      <header>
        <v-btn fab dark small color="grey">
          <v-icon dark>remove</v-icon>
        </v-btn>&nbsp;
        <h1>{{now}} {{startDayNumber}}</h1>&nbsp;
        <v-btn fab dark small color="grey">
          <v-icon dark>add</v-icon>
        </v-btn>
      </header>

      <ul class="weekdays">
        <li>
          <abbr title="S">Sunday</abbr>
        </li>
        <li>
          <abbr title="M">Monday</abbr>
        </li>
        <li>
          <abbr title="T">Tuesday</abbr>
        </li>
        <li>
          <abbr title="W">Wednesday</abbr>
        </li>
        <li>
          <abbr title="T">Thursday</abbr>
        </li>
        <li>
          <abbr title="F">Friday</abbr>
        </li>
        <li>
          <abbr title="S">Saturday</abbr>
        </li>
      </ul>

      <ul class="day-grid">
        <div v-for="i in 35" :key="`1${i}`">
          <li></li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
function dayofyear(d) {
  // d is a Date object
  var yn = d.getFullYear();
  var mn = d.getMonth();
  var dn = d.getDate();
  var d1 = new Date(yn, 0, 1, 12, 0, 0); // noon on Jan. 1
  var d2 = new Date(yn, mn, dn, 12, 0, 0); // noon on input date
  var ddiff = Math.round((d2 - d1) / 864e5);
  return ddiff + 1;
}
const moment = require("moment");
var d = new Date(2018, 9, 28);
export default {
  data() {
    return {
      currentMonth: 11
    };
  },
  mounted() {},
  computed: {
    now() {
      return moment().format("MMMM YYYY");
    },
    startDayNumber() {
      return dayofyear(d);
    }
  }
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  font-size: calc(16px + (26 - 16) * ((100vw - 300px) / (1600 - 300)));
  justify-content: center;
  margin-bottom: 2em;
  background: #000;
  color: #fff;
  min-height: 10vh;
  text-align: center;
}

ul {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 0.5em;
  margin: 0 auto;
  max-width: 99%;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin-left: 0;
  font-size: calc(16px + (21 - 16) * ((100vw - 300px) / (1600 - 300)));
}

ul.weekdays {
  margin-bottom: 1em;
}

ul.weekdays li {
  height: 4vw;
}

ul.day-grid li {
  background-color: #eaeaea;
  border: 1px solid #eaeaea;
  height: 12vw;
  max-height: 125px;
}

ul.weekdays abbr[title] {
  border: none;
  font-weight: 800;
  text-decoration: none;
}

/* ul.day-grid li:nth-child(1),
ul.day-grid li:nth-child(2),
ul.day-grid li:nth-child(3),
ul.day-grid li:nth-child(34),
ul.day-grid li:nth-child(35) {
  background-color: #fff;
} */

@media all and (max-width: 800px) {
  ul {
    grid-gap: 0.25em;
  }

  ul.weekdays li {
    font-size: 0;
  }

  ul.weekdays > li abbr:after {
    content: attr(title);
    font-size: calc(16px + (26 - 16) * ((100vw - 300px) / (1600 - 300)));
    text-align: center;
  }
}
</style>