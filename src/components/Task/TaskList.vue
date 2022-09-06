<template>
  <div class="task-list-container pt-2 pb-2">
    <b-list-group class="mb-2">
      <b-list-group-item v-if="tasks.length === 0">
        No tasks!
      </b-list-group-item>
      <Task
        v-for="(task, i) in tasks"
        :key="`task${i}_${task.name}`"
        :task="task"
        :idx="i"
        role="button"
        tabindex="0"
      />
    </b-list-group>
    <b-button
      @click="createTask"
      v-b-modal.task-modal
      variant="primary"
      class="text-dark"
    >
      Add Task
    </b-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Task from "./Task.vue";
import vxm from "@/store/index.vuex";
import UserTask from "@/types/Task";

@Component({
  components: {
    Task,
  },
})
export default class TaskList extends Vue {
  get tasks(): UserTask[] {
    return this.vxm.store.tasks;
  }

  get vxm(): typeof vxm {
    return vxm;
  }

  createTask() {
    vxm.store.editedIndex = -1; // No task is being edited
    vxm.store.editedTaskCompleted = false;
  }
}
</script>
<style scoped></style>
