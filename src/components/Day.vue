<template>
  <div class="day p-1">
    <div class="row justify-content-center font-weight-bold">
      <div>{{ month + 1 }}/{{ day }}</div>
    </div>
    <div
      v-for="(chunk, i) in chunks"
      :key="`${month}/${day}_chunk_${i}`"
      class="chunk row m-0 mb-1 justify-content-between"
    >
      <div class="col-auto">
        {{ chunk.task.name }}
      </div>
      <div class="col-auto">{{ chunk.duration }} min</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Months, WeekDays } from "../types/Calendar";
import vxm from "../store";
import Chunk from "@/types/Chunk";

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

  get chunks(): Chunk[] {
    return vxm.store.chunks.filter(
      (chunk) =>
        chunk.date.getDate() === this.day - 1 &&
        chunk.date.getMonth() == this.month
    );
  }
}
</script>
<style lang="scss" scoped>
.day {
  border: 1px gray solid;
}
.chunk {
  background-color: yellow;
}
</style>
