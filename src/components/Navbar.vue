<template>
  <div class="navbar-container">
    <b-navbar variant="primary">
      <b-navbar-brand>
        SmarterCalendar
        <span class="text-secondary">v1.1.0</span></b-navbar-brand
      >
      <b-navbar-nav class="ml-auto">
        <b-button class="" variant="secondary">Settings</b-button>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// import { Navbar } from "bootstrap-vue";

@Component
export default class Navbar extends Vue {}
</script>
<style lang="scss" scoped></style>
