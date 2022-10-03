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
import UserTask from "@/types/Task";

@Component
export default class ChunkModal extends Vue {
  get chunk(): Chunk | undefined {
    return vxm.store.modals.chunk.chunk;
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
    vxm.store.storage.updateTasks();
    vxm.store.chunks.update();
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
    vxm.store.storage.updateTasks();
    vxm.store.chunks.update();
  }

  launchTask() {
    if (!this.chunk) {
      return;
    }
    vxm.store.modals.task.index = vxm.store.tasks.indexOf(this.chunk?.task);
    vxm.store.modals.task.completed = false;
    if (vxm.store.modals.task.index === -1) {
      vxm.store.modals.task.index = vxm.store.completedTasks.indexOf(
        this.chunk?.task
      );
      vxm.store.modals.task.completed = true;
    }
    this.$bvModal.show("task-modal");
  }

  completeChunk() {
    if (!this.chunk) {
      return;
    }

    if (this.completed) {
      if (!vxm.store.tasks.includes(this.chunk.task)) {
        vxm.store.tasks.push(this.chunk.task);
      }

      Vue.delete(
        vxm.store.completedChunks,
        vxm.store.completedChunks.indexOf(this.chunk)
      );
    } else {
      if (this.locked) this.unlock();

      this.chunk.date = DateUtils.currentDate;

      vxm.store.completedChunks.push(this.chunk);

      if (
        vxm.store.chunks.chunks.filter(
          (chunk) => chunk.task.id === (this.chunk?.task ?? new UserTask({})).id
        ).length <= 1
      ) {
        Vue.delete(vxm.store.tasks, vxm.store.tasks.indexOf(this.chunk.task));
        vxm.store.completedTasks.push(this.chunk.task);
      }
    }

    vxm.store.storage.updateTasks();
    vxm.store.chunks.update();
    vxm.store.storage.updateCompleted();

    this.$bvModal.hide("chunk-modal");
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
