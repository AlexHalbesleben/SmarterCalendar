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
            class="mb-2"
            prepend="Maximum ideal time"
            append="minutes each day"
          >
            <b-form-input
              type="number"
              :number="true"
              v-model="vxm.store.settings.maxPreferredDailyTime"
            />
          </b-input-group>
        </div>
        <div class="row">
          <b-input-group
            class="mb-2"
            prepend="Maximum ideal time difference"
            append="minutes between days"
          >
            <b-form-input
              type="number"
              :number="true"
              v-model="vxm.store.settings.maxPreferredTimeDiff"
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

@Component
export default class SettingsModal extends Vue {
  updateSettings() {
    vxm.store.uploadSettings();
    vxm.store.updateChunks();
  }

  get vxm(): typeof vxm {
    return vxm;
  }
}
</script>
<style lang="scss" scoped></style>
