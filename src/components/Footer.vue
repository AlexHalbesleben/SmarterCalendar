<template>
  <footer class="w-100 bg-primary fixed-bottom p-2">
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

    <div class="float-right">
      <b-button variant="info" class="text-dark" v-b-modal.how-to-use-modal>
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
