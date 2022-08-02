<template>
  <div class="day p-1" @click="launchModal" v-b-modal.day-modal>
    <div class="row justify-content-center font-weight-bold">
      <div>{{ month + 1 }}/{{ day }}</div>
    </div>
    <div class="day-chunks-container">
      <div
        v-for="(chunk, i) in chunks"
        :key="`${month}/${day}_chunk_${i}`"
        class="chunk row m-0 mb-1 justify-content-between bg-primary rounded text-dark"
        @click.stop="launchChunk(chunk)"
      >
        <div class="col-auto">
          {{ chunk.task.name }}
        </div>
        <div class="col-auto">
          <!-- Rounds to 2 decimal places -->
          {{ Math.round(chunk.duration * 100) / 100 }} min
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { WeekDays } from "../types/Calendar";
import vxm from "../store/index.vuex";
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

  /**
   * Gets the chunks scheduled for this day
   */
  get chunks(): Chunk[] {
    return vxm.store.chunks.filter(
      (chunk) =>
        chunk.date.getDate() === this.day && chunk.date.getMonth() == this.month
    );
  }

  launchModal() {
    vxm.store.dayModalDay = this.day;
    vxm.store.dayModalMonth = this.month;
  }

  launchChunk(chunk: Chunk) {
    vxm.store.editedChunk = chunk;
    this.$bvModal.show("chunk-modal");
  }
}
</script>
<style lang="scss" scoped>
.day-chunks-container {
  max-height: 208px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
