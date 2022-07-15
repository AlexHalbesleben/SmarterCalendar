<template>
  <div class="day p-1">
    {{ month + 1 }}/{{ day }}/{{ year.toString().slice(2) }}
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Months, WeekDays } from "../types/Calendar";

@Component
export default class Day extends Vue {
  @Prop({ required: true })
  day!: number;

  @Prop({ required: true })
  month!: number;

  get year(): number {
    return new Date().getFullYear();
  }

  get weekday(): WeekDays {
    let date = new Date(this.year, this.month, this.day);
    return date.getDay();
  }
}
</script>
<style lang="scss" scoped>
.day {
  border: 1px gray solid;
}
</style>
