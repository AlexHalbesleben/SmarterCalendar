<template>
  <div class="helpmodal-container">
    <b-modal id="help-modal" title="Help" ok-only>
      Test

      <template #modal-footer="{ ok }">
        <b-button class="text-dark" variant="primary" @click="ok()">
          OK
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HelpModal extends Vue {}
</script>
<style lang="scss" scoped></style>
