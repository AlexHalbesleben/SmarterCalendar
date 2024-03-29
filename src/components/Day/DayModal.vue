<template>
  <div class="daymodal-container">
    <b-modal id="day-modal" :title="`${month + 1}/${day}`" @hide="updateChunks">
      <p class="h6" v-show="chunks.length">Chunks ({{ chunks.length }})</p>
      <div
        v-for="(chunk, i) in chunks"
        :key="`${month}/${day}_chunk_${i}`"
        class="chunk row m-0 mb-1 justify-content-between bg-primary rounded text-dark"
        @click="launchChunk(chunk)"
      >
        <div class="col-auto">
          {{ chunk.task.name }}
        </div>
        <div class="col-auto">
          <!-- Rounds to 2 decimal places -->
          {{ Math.round(chunk.duration * 100) / 100 }} min
        </div>
      </div>
      <p class="h6" v-show="events.length">Events ({{ events.length }})</p>
      <div class="day-events-container">
        <div
          v-for="(event, i) in events"
          :key="`${month}/${day}_event_${i}`"
          class="event row m-0 mb-1 justify-content-between rounded text-dark"
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
      <div class="">
        <div class="row">
          <div class="col">Total available time</div>
          <div class="col">{{ timeAvailable }} minutes</div>
        </div>
        <div class="row">
          <div class="col">Total unused time</div>
          <div class="col">{{ timeLeft }} minutes</div>
        </div>
        <div class="row">
          <div class="col">Events</div>
          <div class="col">
            {{ events.reduce((prev, curr) => prev + curr.duration, 0) }} minutes
          </div>
        </div>
        <div class="row">
          <div class="col">Tasks</div>
          <div class="col">{{ time }} minutes</div>
        </div>
        <div class="row">
          <div class="col">Total effort</div>
          <div class="col">{{ effort }}</div>
        </div>
        <div class="row">
          <b-input-group
            class="col chunk-modal-time-edit-top"
            prepend="Start time"
          >
            <b-form-timepicker
              :value="startTimeValue"
              @input="startInput"
              minutes-step="5"
              @blur="updateChunks"
            />
            <b-input-group-append is-text>
              <b-form-checkbox
                class="mr-n2"
                @change="startCheck"
                :checked="startTimeLocked"
              />
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="row">
          <b-input-group
            class="col chunk-modal-time-edit-bottom"
            prepend="End time"
          >
            <b-form-timepicker
              :value="endTimeValue"
              @input="endInput"
              minutes-step="5"
              @blur="updateChunks"
            />
            <b-input-group-append is-text>
              <b-form-checkbox
                class="mr-n2"
                @change="endCheck"
                :checked="endTimeLocked"
              />
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <template #modal-footer="{ ok, cancel }">
        <b-button @click="cancel()" variant="info" class="text-dark"
          >Cancel</b-button
        >
        <b-button @click="ok()" variant="primary" class="text-dark"
          >OK</b-button
        >
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";
import Chunk from "@/types/Chunk";
import DateUtils from "@/util/DateUtils";
import UserEvent from "@/types/Event";

@Component
export default class DayModal extends Vue {
  get vxm(): typeof vxm {
    return vxm;
  }

  get day(): number {
    return vxm.store.modals.day.day;
  }

  get month(): number {
    return vxm.store.modals.day.month;
  }

  launchChunk(chunk: Chunk) {
    vxm.store.modals.chunk.chunk = chunk;
    this.$bvModal.show("chunk-modal");
  }

  launchEvent(event: UserEvent) {
    vxm.store.modals.event.index = vxm.store.events.indexOf(event);
    this.$bvModal.show("event-modal");
  }

  get chunks(): Chunk[] {
    return vxm.store.chunks.chunks.filter(
      (chunk) =>
        chunk.date.getDate() === this.day && chunk.date.getMonth() == this.month
    );
  }

  get events(): UserEvent[] {
    return vxm.store.events.filter(
      (event: UserEvent) =>
        event.date.getDate() === this.day &&
        event.date.getMonth() === this.month
    );
  }

  get time(): number {
    return this.chunks.reduce((prev, curr) => prev + curr.duration, 0);
  }

  get effort(): number {
    return this.chunks.reduce((prev, curr) => prev + curr.effort, 0);
  }

  get date(): Date {
    return DateUtils.constructDate(this.day, this.month);
  }

  get timeAvailable(): number {
    return vxm.store.settings.timeOnDay(this.date);
  }

  get timeLeft(): number {
    return (
      this.timeAvailable -
      this.events.reduce((prev, curr) => prev + curr.duration, 0) -
      this.time
    );
  }

  get numKey() {
    return this.date.getTime();
  }

  get startTimeLocked() {
    return vxm.store.settings.dayStartTimes[this.numKey] ? true : false;
  }

  get endTimeLocked() {
    return vxm.store.settings.dayEndTimes[this.numKey] ? true : false;
  }

  startTime = "00:00:00";
  endTime = "00:00:00";

  lockStart() {
    Vue.set(vxm.store.settings.dayStartTimes, this.numKey, this.startTime);
    vxm.store.storage.updateSettings();
    this.updateChunks();
  }

  lockEnd() {
    Vue.set(vxm.store.settings.dayEndTimes, this.numKey, this.endTime);
    vxm.store.storage.updateSettings();
    this.updateChunks();
  }

  unlockStart() {
    Vue.delete(vxm.store.settings.dayStartTimes, this.numKey);
    vxm.store.storage.updateSettings();
    this.updateChunks();
  }

  unlockEnd() {
    Vue.delete(vxm.store.settings.dayEndTimes, this.numKey);
    vxm.store.storage.updateSettings();
    this.updateChunks();
  }

  startInput(event: string) {
    this.startTime = event;
    Vue.set(vxm.store.settings.dayStartTimes, this.numKey, event);
    vxm.store.storage.updateSettings();
  }

  endInput(event: string) {
    this.endTime = event;
    Vue.set(vxm.store.settings.dayEndTimes, this.numKey, event);
    vxm.store.storage.updateSettings();
  }

  startCheck() {
    if (this.startTimeLocked) {
      this.unlockStart();
    } else {
      this.lockStart();
    }
  }

  endCheck() {
    if (this.endTimeLocked) {
      this.unlockEnd();
    } else {
      this.lockEnd();
    }
  }

  get startTimeValue(): string {
    const { dayStartTimes, dailyStartTimes, baseStartTime, timeToString } =
      vxm.store.settings;
    return (
      dayStartTimes[this.numKey] ||
      dailyStartTimes[DateUtils.dayOfWeek(this.date)] ||
      timeToString(baseStartTime)
    );
  }

  get endTimeValue(): string {
    const { dayEndTimes, dailyEndTimes, baseEndTime, timeToString } =
      vxm.store.settings;
    return (
      dayEndTimes[this.numKey] ||
      dailyEndTimes[DateUtils.dayOfWeek(this.date)] ||
      timeToString(baseEndTime)
    );
  }

  updateChunks() {
    this.vxm.store.chunks.update();
  }
}
</script>
<style lang="scss" scoped>
.chunk-modal-time-edit-top > .input-group-prepend > .input-group-text {
  border-bottom-left-radius: 0;
}
.chunk-modal-time-edit-top > .input-group-append > .input-group-text {
  border-bottom-right-radius: 0;
}

.chunk-modal-time-edit-bottom > .input-group-prepend > .input-group-text {
  border-top-left-radius: 0;
}

.chunk-modal-time-edit-bottom > .input-group-append > .input-group-text {
  border-top-right-radius: 0;
}

.chunk-modal-time-edit-bottom {
  margin-top: -1px; // Avoid double border
}
</style>
