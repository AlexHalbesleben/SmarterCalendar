<template>
  <div class="event-list-container pt-2 pb-2">
    <b-list-group class="mb-2">
      <b-list-group-item v-if="events.length === 0">
        No events!
      </b-list-group-item>
    </b-list-group>
    <b-button
      @click="createEvent"
      v-b-modal.event-modal
      variant="primary"
      class="text-dark"
    >
      Add Event
    </b-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import UserEvent from "@/types/Event";

@Component
export default class TaskList extends Vue {
  get events(): UserEvent[] {
    return this.vxm.store.events;
  }

  get vxm(): typeof vxm {
    return vxm;
  }

  createEvent() {
    vxm.store.editedEventIndex = -1; // No task is being edited
  }
}
</script>
<style scoped></style>
