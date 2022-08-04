<template>
  <div class="event-list-container pt-2 pb-2">
    <b-list-group class="mb-2">
      <b-list-group-item v-if="events.length === 0">
        No events!
      </b-list-group-item>
      <Event
        v-for="(event, i) in events"
        :key="i"
        :idx="i"
        :event="event"
        role="button"
        tabindex="0"
      />
    </b-list-group>
    <b-button
      @click="createEvent"
      v-b-modal.event-modal
      variant="info"
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
import Event from "./Event.vue";

@Component({
  components: {
    Event,
  },
})
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
