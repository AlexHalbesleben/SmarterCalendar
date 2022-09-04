<template>
  <b-list-group-item @click="editReminder" class="reminder-list-item">
    {{ reminder.name }}
  </b-list-group-item>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import UserEvent from "@/types/Event";
import vxm from "@/store/index.vuex";

@Component
export default class Reminder extends Vue {
  @Prop({ required: true })
  reminder!: UserEvent;

  @Prop({ required: true })
  idx!: number;

  editReminder() {
    vxm.store.editedReminderIndex = this.idx;
    this.$bvModal.show("reminder-modal");
  }

  get vxm(): typeof vxm {
    return vxm;
  }
}
</script>
<style scoped></style>
