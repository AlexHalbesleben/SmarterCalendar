<template>
  <div class="remindermodal-container">
    <b-modal
      id="reminder-modal"
      @show="onShow"
      @ok="submit"
      :title="`${editedIndex === -1 ? 'Create' : 'Edit'} Reminder`"
      @cancel="deleteTask"
      v-model="displayed"
    >
      <div class="container" @keydown.stop @keypress.enter="submit">
        <div class="row mb-2">
          <b-input-group prepend="Name" class="col">
            <b-form-input v-model="reminder.name" @keypress.stop />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group prepend="Date" class="col">
            <b-form-datepicker v-model="reminder.date" value-as-date />
          </b-input-group>
        </div>
        <div class="row mb-2 no-gutters">
          <b-input-group class="col" prepend="Description">
            <b-form-textarea class="px-2" v-model="reminder.description">
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
import { Component, Prop, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import Reminder from "@/types/Reminder";

@Component
export default class ReminderModal extends Vue {
  reminder!: Reminder;

  // So the inputs don't get mad that there is no current task
  created() {
    this.onShow();
  }

  get editedIndex(): number {
    return vxm.store.modals.reminder.index;
  }

  onShow() {
    let { editedIndex } = this;
    // Sets the template based on whether a new task is being created or an exisiting one is being edited
    this.reminder =
      editedIndex === -1 // If there's no task to copy from
        ? new Reminder({}) // Use sensible defaults
        : {
            ...vxm.store.reminders[editedIndex],
          }; // If there's a task to copy from, do that
  }

  submit() {
    this.$bvModal.hide("reminder-modal");

    let { editedIndex } = this;
    if (editedIndex === -1) {
      // If creating a new task
      vxm.store.reminders.push({
        ...this.reminder,
      });
    } else {
      Vue.set(vxm.store.reminders, editedIndex, { ...this.reminder });
    }
    vxm.store.updateChunks();
    vxm.store.uploadReminders();
  }

  deleteTask() {
    if (this.editedIndex === -1) {
      // If we're creating a task
      return; // We can't delete a task that hasn't been created
    }

    // Using Vue.delete ensures reactivity
    Vue.delete(vxm.store.reminders, this.editedIndex);
    vxm.store.updateChunks(); // Update chunks
    vxm.store.uploadReminders();
  }

  displayed = false;
}
</script>
<style lang="scss" scoped></style>
