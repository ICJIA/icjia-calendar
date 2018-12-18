<template>
  <v-dialog v-model="dialog" width="70%">
    <v-btn slot="activator" light color="primary">
      <v-icon left>print</v-icon>Print
    </v-btn>

    <v-card>
      <v-card-text>
        <div id="eventContent" class="pl-3 pr-3 pt-5 pt-5">
          <div
            v-for="(event, index) in this.$store.state.dayMeta.dayEvents"
            :key="index"
            style="margin-bottom: 50px;"
          >
            <h1 class="rule">{{event.title}}</h1>

            <div class="pl-3 pr-2 mt-3 range">
              <span>
                <span v-html="getEventRange(event)" class></span>
              </span>
              <span style="float: right">
                <span class>{{getDuration(event.duration)}}</span>
              </span>

              <div
                v-html="markdownToHtml(event.description)"
                class="pt-5"
                style="font-weight: 400;"
              ></div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="dialog = false" class="hidden-print">Close
          <v-icon right dark>close</v-icon>
        </v-btn>
        <v-btn color="primary" @click="printModal" class="hidden-print">Print
          <v-icon right dark>print</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true
});
import moment from "moment";
export default {
  data() {
    return {
      dialog: false
    };
  },
  props: {
    event: {
      type: Object
    }
  },
  methods: {
    markdownToHtml(description) {
      const html = md.render(description);
      /** HTML links to open in new tab */
      const pattern = /a href=/g;
      const sanitizedMarkDownText = html.replace(
        pattern,
        "a target='_blank' href="
      );
      return sanitizedMarkDownText;
    },
    getDuration(num) {
      if (num < 1) {
        return `1 day`;
      }
      return `${num} days`;
    },
    getEventRange({ start, end, duration }) {
      if (duration === 0) {
        return moment.utc(start).format("MMM DD, YYYY");
      }

      return `${moment.utc(start).format("MMM DD, YYYY")} - ${moment
        .utc(end)
        .format("MMM DD, YYYY")}`;
    },
    printModal() {
      const modal = document.getElementById("eventContent");
      const cloned = modal.cloneNode(true);
      let section = document.getElementById("print");

      if (!section) {
        section = document.createElement("div");
        section.id = "print";
        document.body.appendChild(section);
      }

      section.innerHTML = "";
      section.appendChild(cloned);
      window.print();
    }
  }
};
</script>

<style>
.rule {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  margin-bottom: 0px;
  width: 100%;
}
.range {
  font-size: 18px !important;
  font-weight: bold;
}

@media screen {
  #print {
    display: none;
  }
}

@media print {
  body * {
    visibility: hidden;
  }
  #print,
  #print * {
    visibility: visible;
    width: 100%;
  }
  #print {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>