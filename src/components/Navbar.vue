<template>
  <div class="navbar-container">
    <b-navbar variant="primary">
      <b-navbar-brand>
        SmarterCalendar
        <span class="text-secondary">v3.0.1</span></b-navbar-brand
      >
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

@Component
export default class Navbar extends Vue {}
</script>
<style lang="scss" scoped></style>
