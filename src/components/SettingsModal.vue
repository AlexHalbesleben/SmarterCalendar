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
            class="col"
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
          <b-input-group class="col" prepend="Start time">
            <b-form-timepicker
              @input="updateStart"
              :value="startTime"
              @blur="vxm.store.updateChunks()"
            />
          </b-input-group>
        </div>
        <div class="row mb-2">
          <b-input-group class="col" prepend="End time">
            <b-form-timepicker
              @input="updateEnd"
              :value="endTime"
              @blur="vxm.store.updateChunks()"
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
                  <b-form-timepicker />
                  <b-input-group-append is-text class="settings-day-append-top">
                    <b-form-checkbox class="mr-n2" />
                  </b-input-group-append>
                </b-input-group>
                <b-input-group
                  class="row no-gutters settings-modal-bottom-day-row"
                >
                  <b-input-group-prepend is-text class="settings-day-prepend">
                    End time
                  </b-input-group-prepend>
                  <b-form-timepicker />
                  <b-input-group-append
                    is-text
                    class="settings-day-append-bottom"
                  >
                    <b-form-checkbox class="mr-n2" />
                  </b-input-group-append>
                </b-input-group>
              </div>
            </b-input-group>
          </div>
        </div>
      </div>
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
    const extracted = time.match(/([0-9]{2}):([0-9]{2})/);
    if (!extracted || !extracted[1] || !extracted[2]) {
      return;
    }
    const hour = parseInt(extracted[1]);
    const minute = parseInt(extracted[2]);

    vxm.store.settings.baseStartTime = hour * 60 + minute;
    vxm.store.uploadSettings();
  }

  get startTime(): string {
    const start = vxm.store.settings.baseStartTime;
    return `${Math.floor(start / 60)}:${Math.floor(start % 60)}`;
  }

  updateEnd(time: string) {
    const extracted = time.match(/([0-9]{2}):([0-9]{2})/);
    if (!extracted || !extracted[1] || !extracted[2]) {
      return;
    }
    const hour = parseInt(extracted[1]);
    const minute = parseInt(extracted[2]);

    vxm.store.settings.baseEndTime = hour * 60 + minute;
    vxm.store.uploadSettings();
  }

  get endTime(): string {
    const end = vxm.store.settings.baseEndTime;
    return `${Math.floor(end / 60)}:${Math.floor(end % 60)}`;
  }

  weekday(num: number): string {
    return WeekDays[num];
  }

  dayStartLocked(day: number): boolean {
    return Object.keys(vxm.store.settings.dailyStartTimes).includes(
      day.toString()
    );
  }

  dayEndLocked(day: number): boolean {
    return Object.keys(vxm.store.settings.dailyStartTimes).includes(
      day.toString()
    );
  }
}
</script>
<style lang="scss" scoped>
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
