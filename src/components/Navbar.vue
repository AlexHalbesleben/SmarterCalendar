<template>
  <div class="navbar-container">
    <b-navbar variant="primary" fixed="top">
      <b-navbar-brand>
        SmarterCalendar
        <span class="text-secondary version" v-b-modal.changelog-modal
          >v{{ currentVersion }}</span
        >
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button class="text-dark" variant="info" v-b-modal.settings-modal>
          Settings
        </b-button>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { changelog } from "@/types/Changelog";

@Component
export default class Navbar extends Vue {
  get currentVersion(): string {
    return changelog[changelog.length - 1].version;
  }
}
</script>
<style lang="scss" scoped>
.version:hover,
.version:focus {
  text-decoration: underline;
}
</style>
