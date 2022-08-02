<template>
  <div class="chunkmodal-container">
    <b-modal id="chunk-modal" :title="chunk?.task.name">
      {{ chunk?.duration }} minutes
      <br />
      <b-button @click="launchTask">Task</b-button>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import Chunk from "@/types/Chunk";

@Component
export default class ChunkModal extends Vue {
  get chunk(): Chunk | undefined {
    return vxm.store.editedChunk;
  }

  launchTask() {
    if (!this.chunk) {
      return;
    }
    vxm.store.editedIndex = vxm.store.tasks.indexOf(this.chunk?.task);
    this.$bvModal.show("task-modal");
  }
}
</script>
<style lang="scss" scoped></style>
