<template>
  <div class="taskmodal-container">
    <b-modal
      id="task-modal"
      @show="onShow"
      @ok="submit"
      :title="`${editedIndex === -1 ? 'Create' : 'Edit'} Task`"
      :cancel-title="editedIndex === -1 ? 'Cancel' : 'Delete'"
      :cancel-variant="editedIndex === -1 ? 'secondary' : 'danger'"
      @cancel="deleteTask"
    >
      <div class="container">
        <div class="row mb-2">
          <b-input-group prepend="Name" class="col">
            <b-form-input v-model="task.name" />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group prepend="Duration" append="minutes" class="col">
            <b-form-input v-model="task.duration" type="number" />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group prepend="Chunks" class="col">
            <b-form-input v-model="task.chunks" />
          </b-input-group>
        </div>
        <div class="row">
          <b-input-group prepend="Due" class="col">
            <b-form-datepicker v-model="task.due" value-as-date />
          </b-input-group>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script lang="ts">
import UserTask from "@/types/Task";
import { Component, Vue } from "vue-property-decorator";
import vxm from "../store/index.vuex";

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
        : vxm.store.tasks[editedIndex]; // If there's a task to copy from, do that
  }

  submit() {
    let { editedIndex } = vxm.store;
    if (editedIndex === -1) {
      // If creating a new task
      vxm.store.tasks.push(this.task);
    } else {
      vxm.store.tasks[editedIndex] = this.task;
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
}
</script>
<style lang="scss" scoped></style>
