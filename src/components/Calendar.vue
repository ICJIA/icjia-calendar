<template>
  <div>
    <v-layout row wrap class="mb-5">
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
            <li v-for="i in gridSize" :key="`1${i}`" v-html="getDayMeta(i)"></li>
          </ul>
        </div>
      </v-flex>
      <v-flex xs12 sm3>
        <v-switch :label="`Red: ${red.toString()}`" v-model="red" @click="switchEvents('red')"></v-switch>
        <v-switch
          :label="`Yellow: ${yellow.toString()}`"
          v-model="yellow"
          @click="switchEvents('yellow')"
        ></v-switch>
        <v-switch
          :label="`Green: ${green.toString()}`"
          v-model="green"
          @click="switchEvents('green')"
        ></v-switch>
        <v-switch :label="`Blue: ${blue.toString()}`" v-model="blue" @click="switchEvents('blue')"></v-switch>
        <v-switch :label="`Pink: ${pink.toString()}`" v-model="pink" @click="switchEvents('pink')"></v-switch>
      </v-flex>
    </v-layout>
    <div v-if="this.$store.state.debug">
      <v-layout row wrap class="pl-5 pr-5">
        <v-flex xs12>
          <div>
            <h2
              style="border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 15px;"
            >Debug:</h2>
            <h4>isVisible:</h4>
            <div>{{this.isVisible}}</div>
            <h4>calendarHelper:</h4>
            <div>{{this.calendarHelper}}</div>
            <h4>api:</h4>
            <div>{{this.data}}</div>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>

const moment = require("moment");
import {findDayOfYear, createCalendarHelper} from '@/utils'
import _ from 'lodash'
const data = require('@/api/index.json')
export default {
  data() {
    return {
      currentMonth: 12,
      currentYear: 2018,
      debug: true,
      calendarHelper: [],
      red: true,
      green: true,
      yellow: true,
      blue: true,
      pink: true,
      isVisible: ['red', 'yellow','green','pink','blue'],
      data: data
    };
  },
  created() {
   
      this.calendarHelper = createCalendarHelper(2017, 2019)
     
    
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


      dayObj.dayOfYear = dayOfYear

      // pad December with next month 
      if (splitYear && this.currentMonth === 12) {
        year = year + 1
      }
      // pad January with previous month 
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

    
    let dayEvents = ''
    if (data[year]) {
      if (data[year][dayObj.dayOfYear]) {
        
        dayEvents = (data[year][dayObj.dayOfYear])
       
        
      }
        
    }
    
    
    
     
      
      let html = `<span style="${backgroundStyle}; padding-left: 2px; padding-right: 2px;">${dayObj.day}`
        if (dayEvents) {
            dayEvents.forEach((x) => {
              if (this.isVisible.includes(x.color)) {
                html = html + `<div style="font-size: 12px; background: ${x.color}" >${x.description}</div>`
              }
              
            })
           
        }
      
      if (this.$store.state.debug) {
        html = html + `<div style="font-weight: bold; font-size: 12px;">`
        
        html = html + `<div >Day: ${dayObj.dayOfYear}</div>`
        html = html + `<div >gridID: ${dayObj.gridID}</div>`
        html = html + `<div >${dayObj.fullDate}</div>`
        html = html + `<div >${dayObj.year}</div>`
       
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
     
    },
     switchEvents(color) {
        if (this.isVisible.includes(color)) {
         this.isVisible = _.remove(this.isVisible, function(n) {
            return n !==color
          });
        } else {
          this.isVisible.push(color)
        }
      // console.log(isVisible)
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
  max-height: 200px;
  
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