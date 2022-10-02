<template>
  <div class="taskmodal-container">
    <b-modal
      id="task-modal"
      @show="onShow"
      @ok="submit"
      :title="`${editedIndex === -1 ? 'Create' : 'Edit'} Task`"
      @cancel="completeTask"
      v-model="displayed"
    >
      <div class="container" @keyup.stop @keypress.enter="submit">
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
          <b-input-group prepend="Start date" class="col">
            <b-form-datepicker
              :value="task.startDate ?? currentDate"
              value-as-date
              @input="setStartDate"
            />
            <b-input-group-append is-text>
              <b-form-checkbox
                :checked="task.startDate !== null"
                @input="setStartLocked"
                class="mr-n2"
              />
            </b-input-group-append>
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
        <div class="row mb-2">
          <b-input-group
            class="col"
            prepend="Task is scheduled as "
            append=" as possible"
          >
            <b-form-radio-group
              :options="[
                { text: 'late', value: true },
                { text: 'soon', value: false },
              ]"
              v-model="task.backloaded"
              buttons
              button-variant="info"
            />
          </b-input-group>
        </div>
        <div class="row mb-2 no-gutters">
          <b-input-group class="col" prepend="Description">
            <b-form-textarea
              class="px-2"
              v-model="task.description"
              @keypress.stop
            >
            </b-form-textarea>
          </b-input-group>
        </div>
      </div>
      <template #modal-footer="{ ok, cancel }">
        <b-button variant="danger" @click="deleteTask">
          {{ editedIndex === -1 ? "Cancel" : "Delete" }}</b-button
        >
        <b-button
          v-show="editedIndex !== -1"
          variant="info"
          class="text-dark"
          @click="cancel()"
        >
          Complete
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
import DateUtils from "@/util/DateUtils";
import TaskUtils from "@/util/TaskUtils";

@Component
export default class TaskModal extends Vue {
  task: UserTask =
    this.editedIndex === -1 // If there's no task to copy from
      ? new UserTask({}) // Use sensible defaults
      : {
          get totalEffort(): number {
            return this.effort * this.duration;
          },
          ...(vxm.store.modals.task.completed
            ? vxm.store.completedTasks
            : vxm.store.tasks)[this.editedIndex],
        }; // If there's a task to copy from, do that

  get currentDate(): Date {
    return DateUtils.currentDate;
  }

  get editedIndex(): number {
    return vxm.store.modals.task.index;
  }

  onShow() {
    let editedIndex = vxm.store.modals.task.index;
    // Sets the template based on whether a new task is being created or an exisiting one is being edited
    this.task =
      editedIndex === -1 // If there's no task to copy from
        ? new UserTask({}) // Use sensible defaults
        : {
            get totalEffort(): number {
              return this.effort * this.duration;
            },
            ...(vxm.store.modals.task.completed
              ? vxm.store.completedTasks
              : vxm.store.tasks)[editedIndex],
          }; // If there's a task to copy from, do that
  }

  submit() {
    this.$bvModal.hide("task-modal");

    let editedIndex = vxm.store.modals.task.index;

    if (editedIndex === -1) {
      // If creating a new task
      vxm.store.tasks.push({
        get totalEffort(): number {
          return this.effort * this.duration;
        },
        ...this.task,
      });

      editedIndex = vxm.store.tasks.length - 1;
    } else {
      vxm.store.tasks[editedIndex] = {
        get totalEffort(): number {
          return this.effort * this.duration;
        },
        ...this.task,
      };
    }

    for (let i = 0; i < vxm.store.tasks.length; i++) {
      if (i === editedIndex) continue;

      let t = vxm.store.tasks[i];
      if (t.due.getTime() > this.task.due.getTime()) {
        let editedTask = vxm.store.tasks[editedIndex];
        Vue.delete(vxm.store.tasks, editedIndex);
        vxm.store.tasks.splice(i, 0, editedTask);
        break;
      }
    }

    vxm.store.chunks.update();
    vxm.store.storage.updateTasks();
  }

  completeTask() {
    if (this.editedIndex === -1) {
      // If we're creating a task
      return; // We can't delete a task that hasn't been created
    }

    for (let chunk of vxm.store.chunks.chunks.filter((chunk) =>
      TaskUtils.tasksEqual(chunk.task, this.task)
    )) {
      chunk.date = DateUtils.currentDate;
      vxm.store.completedChunks.push(chunk);
    }

    // Using Vue.delete ensures reactivity
    Vue.delete(vxm.store.tasks, this.editedIndex);
    vxm.store.chunks.update(); // Update chunks
    vxm.store.storage.updateTasks();
    vxm.store.storage.updateCompleted();

    this.$bvModal.hide("task-modal");
  }

  deleteTask() {
    if (this.editedIndex === -1) {
      // If we're creating a task
      return; // We can't delete a task that hasn't been created
    }

    // Using Vue.delete ensures reactivity
    Vue.delete(
      vxm.store.modals.task.completed
        ? vxm.store.completedTasks
        : vxm.store.tasks,
      this.editedIndex
    );
    vxm.store.chunks.update(); // Update chunks
    vxm.store.storage.updateTasks();
    vxm.store.storage.updateCompleted();

    this.$bvModal.hide("task-modal");
  }

  get taskTooltips(): Record<string, string> {
    return TASK_DESCRIPTIONS;
  }

  displayed = false;

  setStartDate(newDate: Date) {
    this.$set(this.task, "startDate", newDate);
  }

  setStartLocked(locked: boolean) {
    if (!locked) {
      this.$set(this.task, "startDate", null);
    }
  }

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
<style lang="scss">
#task-modal .btn-group > label.btn.btn-info {
  border-radius: 0 !important;
}
</style>
