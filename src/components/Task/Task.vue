<template>
  <b-list-group-item @click="editTask" class="task-list-item">
    {{ task.name }}
  </b-list-group-item>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import UserTask from "@/types/Task";
import vxm from "@/store/index.vuex";

@Component
export default class Task extends Vue {
  @Prop({ required: true })
  task!: UserTask;

  @Prop({ required: true })
  idx!: number;

  editTask() {
    vxm.store.modals.task.index = this.idx;
    vxm.store.modals.task.completed = false;
    this.$bvModal.show("task-modal");
  }

  get vxm(): typeof vxm {
    return vxm;
  }
}
</script>
<style scoped></style>
