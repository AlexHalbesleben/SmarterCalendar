<template>
  <div class="eventmodal-container">
    <b-modal
      id="event-modal"
      @show="onShow"
      @ok="submit"
      :title="`${editedIndex === -1 ? 'Create' : 'Edit'} Event`"
      @cancel="deleteTask"
      v-model="displayed"
    >
      <div class="container" @keydown.stop @keypress.enter="submit">
        <div class="row mb-2">
          <b-input-group prepend="Name" class="col">
            <b-form-input v-model="event.name" @keypress.stop trim />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group prepend="Date" class="col">
            <b-form-datepicker
              v-model="event.date"
              value-as-date
              :min="currentDate"
            />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group prepend="Duration" append="minutes" class="col">
            <b-form-input
              v-model="event.duration"
              type="number"
              :number="true"
              min="0"
            />
          </b-input-group>
        </div>
        <div class="row mb-2 no-gutters">
          <b-input-group class="col" prepend="Description">
            <b-form-textarea class="px-2" v-model="event.description">
            </b-form-textarea>
          </b-input-group>
        </div>
      </div>
      <template #modal-footer="{ ok, cancel }">
        <b-button
          :variant="editedIndex === -1 ? 'info' : 'danger'"
          :class="editedIndex === -1 ? 'text-dark' : 'text-light'"
          @click="cancel()"
        >
          {{ editedIndex === -1 ? "Cancel" : "Delete" }}
        </b-button>
        <b-button @click="ok()" variant="primary" class="text-dark">
          OK
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import UserEvent from "@/types/Event";
import DateUtils from "@/util/DateUtils";

@Component
export default class EventModal extends Vue {
  event!: UserEvent;

  // So the inputs don't get mad that there is no current task
  created() {
    this.onShow();
  }

  get editedIndex(): number {
    return vxm.store.editedEventIndex;
  }

  onShow() {
    let { editedIndex } = this;
    // Sets the template based on whether a new task is being created or an exisiting one is being edited
    this.event =
      editedIndex === -1 // If there's no task to copy from
        ? new UserEvent({}) // Use sensible defaults
        : {
            ...vxm.store.events[editedIndex],
          }; // If there's a task to copy from, do that
  }

  submit() {
    this.$bvModal.hide("event-modal");

    let { editedIndex } = this;
    if (editedIndex === -1) {
      // If creating a new task
      vxm.store.events.push({
        ...this.event,
      });
    } else {
      Vue.set(vxm.store.events, editedIndex, { ...this.event });
    }
    vxm.store.updateChunks();
    vxm.store.uploadEvents();
  }

  deleteTask() {
    if (this.editedIndex === -1) {
      // If we're creating a task
      return; // We can't delete a task that hasn't been created
    }

    // Using Vue.delete ensures reactivity
    Vue.delete(vxm.store.events, this.editedIndex);
    vxm.store.updateChunks(); // Update chunks
    vxm.store.uploadEvents();
  }

  displayed = false;

  get currentDate(): Date {
    return DateUtils.currentDate;
  }
}
</script>
<style lang="scss" scoped></style>
