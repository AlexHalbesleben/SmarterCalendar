<template>
  <div class="daymodal-container">
    <b-modal id="day-modal" :title="`${month + 1}/${day}`">
      <p class="h6" v-show="chunks.length">Chunks ({{ chunks.length }})</p>
      <div
        v-for="(chunk, i) in chunks"
        :key="`${month}/${day}_chunk_${i}`"
        class="chunk row m-0 mb-1 justify-content-between bg-primary rounded text-dark"
        @click="launchChunk(chunk)"
      >
        <div class="col-auto">
          {{ chunk.task.name }}
        </div>
        <div class="col-auto">
          <!-- Rounds to 2 decimal places -->
          {{ Math.round(chunk.duration * 100) / 100 }} min
        </div>
      </div>
      <div class="">
        <div class="row">
          <div class="col">Time</div>
          <div class="col">{{ time }} minutes</div>
        </div>
        <div class="row">
          <div class="col">Total effort</div>
          <div class="col">{{ effort }}</div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import Chunk from "@/types/Chunk";

@Component
export default class DayModal extends Vue {
  get day(): number {
    return vxm.store.dayModalDay;
  }

  get month(): number {
    return vxm.store.dayModalMonth;
  }

  launchChunk(chunk: Chunk) {
    vxm.store.editedChunk = chunk;
    this.$bvModal.show("chunk-modal");
  }

  get chunks(): Chunk[] {
    return vxm.store.chunks.filter(
      (chunk) =>
        chunk.date.getDate() === this.day && chunk.date.getMonth() == this.month
    );
  }

  get time(): number {
    return this.chunks.reduce((prev, curr) => prev + curr.duration, 0);
  }

  get effort(): number {
    return this.chunks.reduce((prev, curr) => prev + curr.effort, 0);
  }
}
</script>
<style lang="scss" scoped></style>
