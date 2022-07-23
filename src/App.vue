<template>
  <div id="app" class="container-fluid h-100 pr-0 pl-0">
    <TaskModal />
    <Navbar />
    <div class="row mr-0 ml-0">
      <Calendar class="col" />
    </div>
    <hr />
    <div class="row mr-0 ml-0">
      <TaskList class="col" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TaskList from "./components/TaskList.vue";
import Calendar from "./components/Calendar.vue";
import Navbar from "./components/Navbar.vue";
import TaskModal from "./components/TaskModal.vue";
import vxm from "./store/index";
@Component({
  components: {
    TaskList,
    Calendar,
    Navbar,
    TaskModal,
  },
})
export default class App extends Vue {
  get vxm(): typeof vxm {
    return vxm;
  }
}
</script>

<style lang="scss">
@import "./style/style.scss";

body {
  background-color: $secondary !important;
}

@include media-breakpoint-up(sm) {
  .day {
    min-height: 100px;
  }
}

hr {
  background-color: $secondary-lightened !important;
  border-color: $secondary-lightened !important;
}

.invalid-day {
  background-color: $secondary-darkened;
}
</style>
