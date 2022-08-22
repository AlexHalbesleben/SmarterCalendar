<template>
  <div class="chunkmodal-container">
    <b-modal
      id="chunk-modal"
      :title="`${chunk?.task.name} - ${chunk?.duration} minutes ${
        completed ? '(completed)' : ''
      }`"
      cancel-title="Complete"
      @cancel="completeChunk"
      cancel-variant="info"
      v-model="displayed"
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
          <b-button class="col text-dark" @click="launchTask" variant="info"
            >Edit Task</b-button
          >
        </div>
      </div>
      <template #modal-footer="{ ok, cancel }">
        <b-button variant="info" @click="cancel()" class="text-dark">
          {{ completed ? "Uncomplete" : "Complete" }}
        </b-button>
        <b-button variant="primary" @click="ok()" class="text-dark">
          OK
        </b-button>
      </template>
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

  get completed(): boolean {
    if (!this.chunk) return false;
    return vxm.store.completedChunks.includes(this.chunk);
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

  completeChunk() {
    if (!this.chunk) {
      return;
    }
    const { duration } = this.chunk;

    if (this.completed) {
      this.chunk.task.chunks++;
      this.chunk.task.duration += duration;

      if (!vxm.store.tasks.includes(this.chunk.task)) {
        vxm.store.tasks.push(this.chunk.task);
      }

      Vue.delete(
        vxm.store.completedChunks,
        vxm.store.completedChunks.indexOf(this.chunk)
      );
    } else {
      if (this.locked) this.unlock();

      this.chunk.task.chunks--;
      this.chunk.task.duration -= duration;

      vxm.store.completedChunks.push(this.chunk);

      if (this.chunk.task.chunks === 0) {
        Vue.delete(vxm.store.tasks, vxm.store.tasks.indexOf(this.chunk.task));
      }
    }

    vxm.store.uploadTasks();
    vxm.store.updateChunks();
    vxm.store.uploadCompleted();
  }

  displayed = false;

  mounted() {
    window.addEventListener("keypress", (ev) => {
      if (this.displayed && ev.key === "c") {
        this.completeChunk();
        this.$bvModal.hide("chunk-modal");
      }
    });
  }
}
</script>
<style lang="scss" scoped></style>
