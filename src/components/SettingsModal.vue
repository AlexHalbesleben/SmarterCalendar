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
        <div class="row">
          <b-input-group class="col" prepend="End time">
            <b-form-timepicker
              @input="updateEnd"
              :value="endTime"
              @blur="vxm.store.updateChunks()"
            />
          </b-input-group>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "../store/index.vuex";
import { SETTINGS_DESCRIPTIONS } from "@/types/Settings";

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
}
</script>
<style lang="scss" scoped></style>
