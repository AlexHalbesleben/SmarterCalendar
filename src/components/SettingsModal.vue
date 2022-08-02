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
        <div class="row">
          <b-input-group
            prepend="Effort weight"
            v-b-tooltip.hover
            :title="settingsTooltips['effortWeight']"
            :append="
              vxm.store.settings.effortWeight.toPrecision(valUnderOne ? 1 : 2)
            "
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
}
</script>
<style lang="scss" scoped></style>
