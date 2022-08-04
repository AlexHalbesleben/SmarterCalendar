<template>
  <div class="settingsmodal-container">
    <b-modal
      id="settings-modal"
      title="Settings"
      ok-only
      @ok="updateSettings"
      @close="updateSettings"
      size="lg"
    >
      <div class="container">
        <div class="row mb-2">
          <b-input-group
            prepend="Effort weight"
            v-b-tooltip.hover
            :title="settingsTooltips['effortWeight']"
            :append="
              vxm.store.settings.effortWeight.toPrecision(valUnderOne ? 1 : 2)
            "
            class="col text-dark"
          >
            <b-form-input
              type="range"
              v-model="vxm.store.settings.effortWeight"
              min="0"
              max="5"
              :step="valUnderOne ? 0.1 : 0.5"
              :number="true"
              @keydown.stop
            />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group
            prepend="Time chunking mode"
            class="col"
            v-b-tooltip.hover
            :title="settingsTooltips['timeChunkingModeSpent']"
          >
            <b-form-radio-group
              class="flex-grow-1 time-select-radio"
              button-variant="info"
              buttons
              :options="[
                { text: 'Consider time spent', value: true },
                { text: 'Consider time remaining', value: false },
              ]"
              v-model="vxm.store.settings.timeChunkingModeSpent"
              @input="pushUpdate"
            >
            </b-form-radio-group>
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group class="col" prepend="Start time">
            <b-form-timepicker
              @input="updateStart"
              :value="startTime"
              @blur="vxm.store.updateChunks()"
              minutes-step="5"
              :state="
                vxm.store.settings.baseEndTime >
                vxm.store.settings.baseStartTime
                  ? null
                  : false
              "
            />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group class="col" prepend="End time">
            <b-form-timepicker
              @input="updateEnd"
              :value="endTime"
              @blur="vxm.store.updateChunks()"
              minutes-step="5"
              :state="
                vxm.store.settings.baseEndTime >
                vxm.store.settings.baseStartTime
                  ? null
                  : false
              "
            />
          </b-input-group>
        </div>

        <div class="mt-2">
          <div v-for="(j, i) in 7" :key="i" class="mb-2">
            <b-input-group :prepend="weekday(i)">
              <div class="flex-grow-1">
                <b-input-group class="row no-gutters">
                  <b-input-group-prepend is-text class="settings-day-prepend">
                    Start time
                  </b-input-group-prepend>
                  <b-form-timepicker
                    :value="
                      daysStartLocked[i]
                        ? vxm.store.settings.dailyStartTimes[i]
                        : startTime
                    "
                    minutes-step="5"
                    @input="handleStartInput($event, i)"
                    @blur="vxm.store.updateChunks"
                  />
                  <b-input-group-append is-text class="settings-day-append-top">
                    <b-form-checkbox
                      class="mr-n2"
                      @change="handleStartCheck(i)"
                      :checked="daysStartLocked[i]"
                    />
                  </b-input-group-append>
                </b-input-group>
                <b-input-group
                  class="row no-gutters settings-modal-bottom-day-row"
                >
                  <b-input-group-prepend is-text class="settings-day-prepend">
                    End time
                  </b-input-group-prepend>
                  <b-form-timepicker
                    :value="
                      daysEndLocked[i]
                        ? vxm.store.settings.dailyEndTimes[i]
                        : endTime
                    "
                    minutes-step="5"
                    @input="handleEndInput($event, i)"
                    @blur="vxm.store.updateChunks"
                  />
                  <b-input-group-append
                    is-text
                    class="settings-day-append-bottom"
                  >
                    <b-form-checkbox
                      class="mr-n2"
                      @change="handleEndCheck(i)"
                      :checked="daysEndLocked[i]"
                    />
                  </b-input-group-append>
                </b-input-group>
              </div>
            </b-input-group>
          </div>
        </div>
      </div>
      <template #modal-footer="{ ok }">
        <b-button variant="primary" class="text-dark" @click="ok">OK</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "../store/index.vuex";
import { SETTINGS_DESCRIPTIONS } from "@/types/Settings";
import { WeekDays } from "@/types/Calendar";

@Component
export default class SettingsModal extends Vue {
  /**
   * Formally updates the settings. Uploads them to local storage and rechunks.
   */
  updateSettings() {
    vxm.store.uploadSettings();
    vxm.store.updateChunks();
  }

  get settingsTooltips(): Record<string, string> {
    return SETTINGS_DESCRIPTIONS;
  }

  /**
   * Whether the effort weight setting is below 1. Used for determining the rounding behavior and snap value of the setting on the modal.
   */
  get valUnderOne(): boolean {
    return vxm.store.settings.effortWeight < 1;
  }

  get vxm(): typeof vxm {
    return vxm;
  }

  updateStart(time: string) {
    vxm.store.settings.baseStartTime = vxm.store.settings.stringToTime(time);
    vxm.store.uploadSettings();
  }

  get startTime(): string {
    return vxm.store.settings.timeToString(vxm.store.settings.baseStartTime);
  }

  updateEnd(time: string) {
    vxm.store.settings.baseEndTime = vxm.store.settings.stringToTime(time);
    vxm.store.uploadSettings();
  }

  get endTime(): string {
    return vxm.store.settings.timeToString(vxm.store.settings.baseEndTime);
  }

  startTimes: string[] = [];
  endTimes: string[] = [];

  mounted() {
    for (let i = 0; i < 6; i++) {
      this.startTimes.push(
        vxm.store.settings.dailyStartTimes[i] || this.startTime
      );
      this.endTimes.push(vxm.store.settings.dailyEndTimes[i] || this.endTime);
    }
  }

  weekday(num: number): string {
    return WeekDays[num];
  }

  get daysStartLocked(): boolean[] {
    let ret = [];

    for (let i = 0; i < 7; i++) {
      ret.push(vxm.store.settings.dailyStartTimes[i] ? true : false);
    }

    return ret;
  }

  get daysEndLocked(): boolean[] {
    let ret = [];

    for (let i = 0; i < 7; i++) {
      ret.push(vxm.store.settings.dailyEndTimes[i] ? true : false);
    }

    return ret;
  }

  handleStartInput(event: string, day: number) {
    this.startTimes[day] = event; // Update local data
    // Changing the time "locks" the settings
    Vue.set(vxm.store.settings.dailyStartTimes, day, event);

    // Upload changes
    vxm.store.uploadSettings();
  }

  /** {@link handleStartInput}, just for the end time */
  handleEndInput(event: string, day: number) {
    this.endTimes[day] = event;

    Vue.set(vxm.store.settings.dailyEndTimes, day, event);

    vxm.store.uploadSettings();
  }

  handleStartCheck(day: number) {
    let locked = this.daysStartLocked[day];
    if (!locked) {
      // If unlocked, lock
      Vue.set(vxm.store.settings.dailyStartTimes, day, this.startTimes[day]);
    } else {
      // If locked, unlock
      Vue.delete(vxm.store.settings.dailyStartTimes, day);
    }

    this.pushUpdate();
  }

  /** {@link handleStartCheck}, just for the end time */
  handleEndCheck(day: number) {
    const locked = this.daysEndLocked[day];
    if (!locked) {
      Vue.set(vxm.store.settings.dailyEndTimes, day, this.endTimes[day]);
    } else {
      Vue.delete(vxm.store.settings.dailyEndTimes, day);
    }

    this.pushUpdate();
  }

  pushUpdate() {
    vxm.store.uploadSettings();
    vxm.store.updateChunks();
  }
}
</script>
<style lang="scss">
.time-select-radio > label:first-child {
  border-radius: 0;
}
.settings-day-prepend > .input-group-text {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.settings-modal-bottom-day-row {
  margin-top: -1px; // Removes "double border"
}

.settings-day-append-top > .input-group-text {
  border-bottom-right-radius: 0;
}

.settings-day-append-bottom > .input-group-text {
  border-top-right-radius: 0;
}
</style>
