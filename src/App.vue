<template>
  <div id="app" class="container-fluid h-100 pr-0 pl-0">
    <TaskModal />
    <Navbar />
    <div class="row mr-0 ml-0">
      <Calendar class="col-12 col-lg-8" />
      <TaskList class="col-lg" />
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
import { UserTask } from "./types/Task";

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
@import "./style.scss";

body {
  background-color: $secondary !important;
}
</style>
