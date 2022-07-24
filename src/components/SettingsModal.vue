<template>
  <div class="settingsmodal-container">
    <b-modal id="settings-modal" title="Settings">
      <div class="container"></div>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vxm from "../store/index.vuex";

@Component
export default class SettingsModal extends Vue {}
</script>
<style lang="scss" scoped></style>
