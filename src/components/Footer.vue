<template>
  <footer class="w-100 bg-primary fixed-bottom p-2">
    By
    <b-link href="https://github.com/AlexHalbesleben" class="text-secondary"
      >Alex Halbesleben</b-link
    >
  </footer>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Footer extends Vue {}
</script>
<style lang="scss" scoped></style>
