<template>
  <div class="taskmodal-container">
    <b-modal
      id="task-modal"
      @show="onShow"
      @ok="submit"
      :title="`${editedIndex === -1 ? 'Create' : 'Edit'} Task`"
      @cancel="deleteTask"
      v-model="displayed"
    >
      <div class="container" @keydown.stop @keypress.enter="submit">
        <div class="row mb-2">
          <b-input-group prepend="Name" class="col">
            <b-form-input v-model="task.name" @keypress.stop />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group
            prepend="Due"
            class="col"
            v-b-tooltip.hover
            :title="taskTooltips['due']"
          >
            <b-form-datepicker v-model="task.due" value-as-date />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group prepend="Duration" append="minutes" class="col">
            <b-form-input
              v-model="task.duration"
              type="number"
              :number="true"
              v-b-tooltip.hover
              :title="taskTooltips['duration']"
            />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group
            prepend="Chunks"
            class="col"
            v-b-tooltip.hover
            :title="taskTooltips['chunks']"
          >
            <b-form-input v-model="task.chunks" type="number" :number="true" />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group
            class="col"
            prepend="Effort"
            v-b-tooltip.hover
            :title="taskTooltips['effort']"
          >
            <b-form-input v-model="task.effort" type="number" :number="true" />
          </b-input-group>
        </div>
        <div class="row mb-2 no-gutters">
          <b-input-group class="col" prepend="Description">
            <b-form-textarea class="px-2" v-model="task.description">
            </b-form-textarea>
          </b-input-group>
        </div>
      </div>
      <template #modal-footer="{ ok, cancel }">
        <b-button
          :variant="editedIndex !== -1 ? 'info' : 'danger'"
          :class="editedIndex !== -1 ? 'text-dark' : 'text-light'"
          @click="cancel()"
        >
          {{ editedIndex === -1 ? "Cancel" : "Complete" }}
        </b-button>
        <b-button @click="ok()" variant="primary" class="text-dark">
          OK
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import UserTask, { TASK_DESCRIPTIONS } from "@/types/Task";
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";

@Component
export default class TaskModal extends Vue {
  task!: UserTask;

  // So the inputs don't get mad that there is no current task
  created() {
    this.onShow();
  }

  get editedIndex(): number {
    return vxm.store.editedIndex;
  }

  onShow() {
    let { editedIndex } = vxm.store;
    // Sets the template based on whether a new task is being created or an exisiting one is being edited
    this.task =
      editedIndex === -1 // If there's no task to copy from
        ? new UserTask() // Use sensible defaults
        : {
            get totalEffort(): number {
              return this.effort * this.duration;
            },
            ...vxm.store.tasks[editedIndex],
          }; // If there's a task to copy from, do that
  }

  submit() {
    this.$bvModal.hide("task-modal");

    let { editedIndex } = vxm.store;
    if (editedIndex === -1) {
      // If creating a new task
      vxm.store.tasks.push({
        get totalEffort(): number {
          return this.effort * this.duration;
        },
        ...this.task,
      });
    } else {
      vxm.store.tasks[editedIndex] = {
        get totalEffort(): number {
          return this.effort * this.duration;
        },
        ...this.task,
      };
    }
    vxm.store.updateChunks();
    vxm.store.uploadTasks();
  }

  deleteTask() {
    if (this.editedIndex === -1) {
      // If we're creating a task
      return; // We can't delete a task that hasn't been created
    }

    // Using Vue.delete ensures reactivity
    Vue.delete(vxm.store.tasks, this.editedIndex);
    vxm.store.updateChunks(); // Update chunks
    vxm.store.uploadTasks();
  }

  get taskTooltips(): Record<string, string> {
    return TASK_DESCRIPTIONS;
  }

  displayed = false;

  mounted() {
    window.addEventListener("keypress", (ev) => {
      if (this.displayed && ev.key === "c") {
        this.deleteTask();
        this.$bvModal.hide("task-modal");
      }
    });
  }
}
</script>
<style lang="scss" scoped></style>
