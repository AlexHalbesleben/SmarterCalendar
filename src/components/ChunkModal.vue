<template>
  <div class="chunkmodal-container">
    <b-modal id="chunk-modal" :title="chunk?.task.name"> </b-modal>
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
}
</script>
<style lang="scss" scoped></style>
