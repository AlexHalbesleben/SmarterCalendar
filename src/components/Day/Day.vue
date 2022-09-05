<template>
  <div
    class="day p-1 border border-bottom-0"
    @click="launchModal"
    v-b-modal.day-modal
  >
    <div class="row justify-content-center font-weight-bold mb-1">
      <div
        :class="`${isCurrentDay ? 'bg-primary rounded px-1 text-dark' : ''}`"
      >
        {{ month + 1 }}/{{ day }}
      </div>
    </div>
    <div class="day-container">
      <div class="day-chunks-container">
        <div
          v-for="(chunk, i) in chunks"
          :key="`${month}/${day}_chunk_${i}`"
          class="chunk row m-0 mb-1 justify-content-between bg-primary rounded text-dark no-gutters px-1"
          @click.stop="launchChunk(chunk)"
        >
          <div class="col-auto">
            {{ chunk.task.name }}
          </div>
          <div class="col-auto">
            <!-- Rounds to 2 decimal places -->
            {{ Math.round(chunk.duration * 100) / 100 }} min
          </div>
        </div>
      </div>
      <div class="day-completed-chunks-container">
        <div
          v-for="(chunk, i) in completedChunks"
          :key="`${month}/${day}_completed-chunk_${i}`"
          class="completed-chunk row m-0 mb-1 justify-content-between rounded text-dark bg-warning no-gutters px-1"
          @click.stop="launchChunk(chunk)"
        >
          <div class="col-auto">
            {{ chunk.task.name }}
          </div>
          <div class="col-auto">
            <!-- Rounds to 2 decimal places -->
            {{ Math.round(chunk.duration * 100) / 100 }} min
          </div>
        </div>
      </div>
      <div class="day-events-container">
        <div
          v-for="(event, i) in events"
          :key="`${month}/${day}_event_${i}`"
          class="event row m-0 mb-1 justify-content-between rounded text-dark no-gutters px-1"
          @click.stop="launchEvent(event)"
        >
          <div class="col-auto">
            {{ event.name }}
          </div>
          <div class="col-auto">
            <!-- Rounds to 2 decimal places -->
            {{ Math.round(event.duration * 100) / 100 }} min
          </div>
        </div>
      </div>
      <div class="day-reminders-container">
        <div
          v-for="(reminder, i) in reminders"
          :key="`${month}/${day}_reminder_${i}`"
          class="reminder row m-0 mb-1 justify-content-between rounded bg-quaternary text-dark no-gutters px-1"
          @click.stop="launchReminder(reminder)"
        >
          <div class="col-auto">
            {{ reminder.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { WeekDays } from "@/types/Calendar";
import vxm from "@/store/index.vuex";
import Chunk from "@/types/Chunk";
import DateUtils from "@/util/DateUtils";
import UserEvent from "@/types/Event";
import UserReminder from "@/types/Reminder";

@Component
export default class Day extends Vue {
  @Prop({ required: true })
  day!: number;

  @Prop({ required: true })
  month!: number;

  get year(): number {
    return new Date().getFullYear();
  }

  get weekday(): WeekDays {
    let date = new Date(this.year, this.month, this.day);
    return date.getDay();
  }

  /**
   * Gets the chunks scheduled for this day
   */
  get chunks(): Chunk[] {
    return vxm.store.chunks.filter(
      (chunk) =>
        chunk.date.getDate() === this.day &&
        chunk.date.getMonth() === this.month
    );
  }

  get completedChunks(): Chunk[] {
    return vxm.store.completedChunks.filter(
      (chunk) =>
        chunk.date.getDate() === this.day &&
        chunk.date.getMonth() === this.month
    );
  }

  get events(): UserEvent[] {
    return vxm.store.events.filter(
      (event: UserEvent) =>
        event.date.getDate() === this.day &&
        event.date.getMonth() === this.month
    );
  }

  get reminders(): UserReminder[] {
    return vxm.store.reminders.filter(
      (reminder: UserReminder) =>
        reminder.date.getDate() === this.day &&
        reminder.date.getMonth() === this.month
    );
  }

  launchModal() {
    vxm.store.dayModalDay = this.day;
    vxm.store.dayModalMonth = this.month;
  }

  launchChunk(chunk: Chunk) {
    vxm.store.editedChunk = chunk;
    this.$bvModal.show("chunk-modal");
  }

  launchEvent(event: UserEvent) {
    vxm.store.editedEventIndex = vxm.store.events.indexOf(event);
    this.$bvModal.show("event-modal");
  }

  launchReminder(reminder: UserReminder) {
    vxm.store.editedReminderIndex = vxm.store.reminders.indexOf(reminder);
    this.$bvModal.show("reminder-modal");
  }

  get isCurrentDay(): boolean {
    const currentDate = DateUtils.currentDate;
    return (
      this.day === currentDate.getDate() &&
      this.month === currentDate.getMonth()
    );
  }
}
</script>
<style lang="scss" scoped>
.day-container {
  max-height: 416px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
  padding-left: 2px;
}

.day {
  border-right: 1px solid !important;
}
</style>
