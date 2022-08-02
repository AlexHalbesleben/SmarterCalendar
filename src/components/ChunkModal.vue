<template>
  <div class="chunkmodal-container">
    <b-modal
      id="chunk-modal"
      :title="`${chunk?.task.name} - ${chunk?.duration} minutes`"
    >
      <div class="container">
        <div class="row mb-2" v-if="chunk">
          <b-input-group prepend="Date" class="col">
            <b-form-datepicker
              v-model="chunk.date"
              value-as-date
              @input="lock"
            />
            <b-input-group-append is-text>
              <b-form-checkbox
                :checked="locked"
                @input="handleChange"
                class="mr-n2"
              />
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="row no-gutters">
          <b-button class="col" @click="launchTask">Edit Task</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import Chunk from "@/types/Chunk";
import DateUtils from "@/util/DateUtils";

@Component
export default class ChunkModal extends Vue {
  get chunk(): Chunk | undefined {
    return vxm.store.editedChunk;
  }

  get simplifiedChunk(): {
    date: Date;
    number: number;
  } {
    const { date, number } = this.chunk || {
      date: DateUtils.currentDate,
      number: 0,
    };
    return { date, number };
  }

  get locked() {
    return (
      this.chunk &&
      this.simplifiedChunk &&
      this.chunk.task.lockedChunks.some(
        (chunk) => chunk.number === this.chunk?.number
      )
    );
  }

  handleChange(checked: boolean) {
    if (checked) {
      this.lock();
    } else {
      this.unlock();
    }
  }

  unlock() {
    console.log("unlocked");
    if (!this.chunk) {
      return;
    }
    this.chunk.task.lockedChunks = this.chunk.task.lockedChunks.filter(
      (chunk) => chunk.number !== this.chunk?.number
    );
    vxm.store.uploadTasks();
    vxm.store.updateChunks();
  }

  lock() {
    console.log("locked");
    if (
      this.chunk?.task.lockedChunks.some(
        (chunk) => chunk.number === this.chunk?.number
      )
    ) {
      return;
    }
    this.chunk?.task.lockedChunks.push(this.simplifiedChunk);
    vxm.store.uploadTasks();
    vxm.store.updateChunks();
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
