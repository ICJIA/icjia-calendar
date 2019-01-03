<template>
  <div style="background-color: #ccc !important;">
    <calendar></calendar>
  </div>
</template>

<script>
import Calendar from "@/components/Calendar.vue";
export default {
  components: {
    Calendar
  },
  mounted() {
    this.$store
      .dispatch("getData")
      .then(response => this.$store.dispatch("structureData", response))
      .then(r => {
        console.log(r);
      })
      .catch(e => {
        console.log("Data error: ", e);
      });
  }
};
</script>
<style>
</style>
