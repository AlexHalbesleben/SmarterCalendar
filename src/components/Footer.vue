<template>
  <footer
    class="w-100 bg-primary fixed-bottom p-2 row no-gutters align-items-center"
  >
    <div class="col">
      <b-link
        href="https://github.com/AlexHalbesleben/SmarterCalendar"
        class="text-secondary"
      >
        Code
      </b-link>
      by
      <b-link href="https://github.com/AlexHalbesleben" class="text-secondary">
        Alex Halbesleben
      </b-link>
    </div>

    <div class="col">
      <b-button
        variant="info"
        class="text-dark float-right"
        v-b-modal.help-modal
      >
        ?
      </b-button>
    </div>
  </footer>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Footer extends Vue {}
</script>
<style lang="scss" scoped></style>
