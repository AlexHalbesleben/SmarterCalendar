<template>
  <div class="reminder-list-container pt-2 pb-2">
    <b-list-group class="mb-2">
      <b-list-group-item
        v-if="!reminders.find((reminder) => notInPast(reminder.date))"
      >
        No {{ reminders.length === 0 ? "" : "future " }}reminders!
      </b-list-group-item>
      <Reminder
        v-for="(reminder, i) in reminders"
        :key="i"
        :idx="i"
        :reminder="reminder"
        role="button"
        tabindex="0"
        v-show="notInPast(reminder.date)"
      />
    </b-list-group>
    <b-button
      @click="createReminder"
      v-b-modal.reminder-modal
      variant="quaternary"
    >
      Add Reminder
    </b-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import UserReminder from "@/types/Reminder";
import Reminder from "./Reminder.vue";
import DateUtils from "@/util/DateUtils";

@Component({
  components: {
    Reminder,
  },
})
export default class ReminderList extends Vue {
  get reminders(): UserReminder[] {
    return this.vxm.store.reminders;
  }

  get vxm(): typeof vxm {
    return vxm;
  }

  createReminder() {
    vxm.store.modals.reminder.index = -1; // No task is being edited
  }

  // Returns true if the date is in the future
  notInPast(date: Date): boolean {
    return (
      date.getTime() >= DateUtils.stripTime(DateUtils.currentDate).getTime()
    );
  }
}
</script>
<style scoped></style>
