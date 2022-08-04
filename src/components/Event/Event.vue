<template>
  <b-list-group-item @click="editEvent" class="event-list-item">
    {{ event.name }}
  </b-list-group-item>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import UserEvent from "@/types/Event";
import vxm from "@/store/index.vuex";

@Component
export default class Task extends Vue {
  @Prop({ required: true })
  event!: UserEvent;

  @Prop({ required: true })
  idx!: number;

  editEvent() {
    vxm.store.editedEventIndex = this.idx;
    this.$bvModal.show("event-modal");
  }

  get vxm(): typeof vxm {
    return vxm;
  }
}
</script>
<style scoped></style>
