<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <header>
          <v-btn fab dark small color="grey" @click="lastMonth()">
            <v-icon dark>remove</v-icon>
          </v-btn>&nbsp;
          <h1>{{currentDate}}</h1>&nbsp;
          <v-btn fab dark small color="grey" @click="nextMonth()">
            <v-icon dark>add</v-icon>
          </v-btn>
        </header>
      </v-flex>

      <v-flex xs12 sm9>
        <div class="calendar">
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
            <!-- <li>{{getDayMeta(i)}}</li> -->
            <li v-for="i in gridSize" :key="`1${i}`" v-html="getDayMeta(i)"></li>
          </ul>
        </div>
      </v-flex xs12 sm3>
      <v-flex>Second column</v-flex>
    </v-layout>
  </div>
</template>

<script>

const moment = require("moment");
function findDayOfYear (date) {
  var oneDay = 1000 * 60 * 60 * 24; // A day in milliseconds
  var og = {                        // Saving original data
    ts: date.getTime(),
    dom: date.getDate(),            // We don't need to save hours/minutes because DST is never at 12am.
    month: date.getMonth()
  }
  date.setDate(1);                  // Sets Date of the Month to the 1st.
  date.setMonth(0);                 // Months are zero based in JS's Date object
  var start_ts = date.getTime();    // New Year's Midnight JS Timestamp
  var diff = og.ts - start_ts;

  date.setDate(og.dom);             // Revert back to original date object
  date.setMonth(og.month);          // This method does preserve timezone
  return Math.round(diff / oneDay) + 1; // Deals with DST globally. Ceil fails in Australia. Floor Fails in US.
}
export default {
  data() {
    return {
      currentMonth: 12,
      currentYear: 2018,
      debug: true,
      calendarHelper: []
    };
  },
  created() {
    // get day of week for 1/1/2018

let calendarHelper = {}
    let startYear = 2017
    let endYear = 2020
    let totalDays
     
    for (let y = startYear; y<=endYear; y++) {
      let isLeapYear = moment([y]).isLeapYear()
     
      let gridSize
      let gridLayout=[]

      for (let i=0; i < 12; i++) {
      let obj = {}

      if (isLeapYear) {
        totalDays = 366
      } else {
        totalDays = 365
      }
   
      obj.firstDayOfTheMonth = new Date(y, i, 1)
       obj.isLeapYear = isLeapYear
       
      obj.dayNumber = findDayOfYear(obj.firstDayOfTheMonth)
      obj.startDayOfWeek = obj.firstDayOfTheMonth.getDay()
      let startGridNumber = (obj.dayNumber - obj.startDayOfWeek) -1
      if (startGridNumber < 0) {
        startGridNumber = startGridNumber + totalDays
      }
      obj.startGridNumber = startGridNumber
      if (obj.startDayOfWeek > 3) {
        gridSize = 42
      } else {
        gridSize = 35
      }
      obj.gridSize = gridSize
      gridLayout.push(obj)

     }
   
  
    
    calendarHelper[y] = gridLayout
      }
      this.calendarHelper = calendarHelper
    
   // console.log(this.calendarHelper[this.currentYear][this.currentMonth-1].gridSize)
  },
  methods: {
    getDayMeta(gridID) {
      let backgroundStyle
      let dayObj = {}
      dayObj.gridID = gridID
      let year = this.currentYear
      let dayOfYear
      let splitYear = false;
      let totalDays
      if (this.calendarHelper[this.currentYear][this.currentMonth -1].isLeapYear) {
        totalDays = 366
      } else {
        totalDays = 365
      }
      if (this.calendarHelper[this.currentYear][this.currentMonth -1].startGridNumber +  dayObj.gridID > totalDays) {
        dayOfYear = this.calendarHelper[this.currentYear][this.currentMonth -1].startGridNumber +  dayObj.gridID - totalDays
        splitYear = true
      } else {
        dayOfYear = this.calendarHelper[this.currentYear][this.currentMonth -1].startGridNumber +  dayObj.gridID
        splitYear = false;
      }
      
      
      console.log(year)


      dayObj.dayOfYear = dayOfYear

      // pad December with next month's dates / January with previous month's dates
      if (splitYear && this.currentMonth === 12) {
        year = year + 1
      }

      if (this.currentMonth === 1 && dayObj.dayOfYear > 335) {
        year = year - 1
      }

       

      
     
      
      dayObj.fullDate = moment([year]).dayOfYear(dayObj.dayOfYear);
      dayObj.day = moment(dayObj.fullDate).format('DD')
      dayObj.month = moment(dayObj.fullDate).format('MM')
      dayObj.year = moment(dayObj.fullDate).format('YYYY')
     
      if (dayObj.month - 1 === this.currentMonth -1) {
          backgroundStyle="background-color: #fff; width: 100%; color: #333;"
      } else {
        backgroundStyle="background-color: #eee; width: 100%; color: #555"
      }
      
      let html = `<span style="${backgroundStyle}; padding-left: 2px; padding-right: 2px;">${dayObj.day}`
      if (this.$store.state.debug) {
        html = html + `<div style="font-weight: bold; font-size: 12px;">`
        
        html = html + `<div >Day: ${dayObj.dayOfYear}</div>`
        html = html + `<div >gridID: ${dayObj.gridID}</div>`
        html = html + `<div >${dayObj.fullDate}</div>`
        html = html + `</div>`
      }
      html = html + `</span>`
      return html
    },
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1
         this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    lastMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12
        this.currentYear--
      } else {
        this.currentMonth--
      }
    }
  },
  computed: {
    currentDate() {
      let date = new Date (this.currentYear, this.currentMonth-1, 1)
      return moment(date).format("MMMM YYYY");
    },
    gridSize() {
      return this.calendarHelper[this.currentYear][this.currentMonth-1].gridSize
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
  max-width: 95%;
  padding: 0;
}

li {
  display: flex;
  align-items: left;
  justify-content: left;
  list-style: none;
  margin-left: 0;
  padding: 0px;
  font-size: calc(16px + (21 - 16) * ((100vw - 300px) / (1600 - 300)));
  
}

ul.weekdays {
  margin-bottom: 1em;
}

ul.weekdays li {
  height: 4vw;
}

ul.day-grid li {
  background-color: #fff;
  border: 1px solid #eaeaea;
  height: 12vw;
  max-height: 250px;
  
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