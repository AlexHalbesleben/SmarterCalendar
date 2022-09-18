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
        ? new UserTask({}) // Use sensible defaults
        : {
            get totalEffort(): number {
              return this.effort * this.duration;
            },
            ...(vxm.store.editedTaskCompleted
              ? vxm.store.completedTasks
              : vxm.store.tasks)[editedIndex],
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
        console.log(
          `Condition passed on ${i}: swapping indices ${i} and ${editedIndex}`
        );
        let editedTask = vxm.store.tasks[editedIndex];
        Vue.delete(vxm.store.tasks, editedIndex);
        vxm.store.tasks.splice(i, 0, editedTask);
        break;
      }
    }

    console.log(vxm.store.tasks.map((task) => task.due));

    vxm.store.updateChunks();
    vxm.store.uploadTasks();
  }

  completeTask() {
    if (this.editedIndex === -1) {
      // If we're creating a task
      return; // We can't delete a task that hasn't been created
    }

    const shallowEq = <T extends Record<string, unknown>>(
      a: T,
      b: T
    ): boolean => {
      return [...Object.keys(a), ...Object.keys(b)].every((k) => b[k] === a[k]);
    };

    for (let chunk of vxm.store.chunks.filter((chunk) =>
      shallowEq({ ...chunk.task }, { ...this.task })
    )) {
      chunk.date = DateUtils.currentDate;
      vxm.store.completedChunks.push(chunk);
    }

    // Using Vue.delete ensures reactivity
    Vue.delete(vxm.store.tasks, this.editedIndex);
    vxm.store.updateChunks(); // Update chunks
    vxm.store.uploadTasks();
    vxm.store.uploadCompleted();

    this.$bvModal.hide("task-modal");
  }

  deleteTask() {
    if (this.editedIndex === -1) {
      // If we're creating a task
      return; // We can't delete a task that hasn't been created
    }

    // Using Vue.delete ensures reactivity
    Vue.delete(
      vxm.store.editedTaskCompleted
        ? vxm.store.completedTasks
        : vxm.store.tasks,
      this.editedIndex
    );
    vxm.store.updateChunks(); // Update chunks
    vxm.store.uploadTasks();
    vxm.store.uploadCompleted();

    this.$bvModal.hide("task-modal");
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
<style lang="scss">
#task-modal .btn-group > label.btn.btn-info {
  border-radius: 0 !important;
}
</style>
