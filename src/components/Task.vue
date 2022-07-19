<template>
  <b-list-group-item @click="editTask" class="task-list-item">
    {{ task.name }}
  </b-list-group-item>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import UserTask from "@/types/Task";
import vxm from "@/store";

@Component
export default class Task extends Vue {
  @Prop({ required: true })
  task!: UserTask;

  @Prop({ required: true })
  idx!: number;

  editTask() {
    vxm.store.editedIndex = this.idx;
    this.$bvModal.show("task-modal");
  }

  get vxm(): typeof vxm {
    return vxm;
  }
}
</script>
<style scoped>
.task-list-item {
}
</style>
