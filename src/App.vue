<template>
  <div id="app" class="container-fluid h-100 pr-0 pl-0">
    <TaskModal />
    <SettingsModal />
    <DayModal />
    <ChunkModal />
    <Navbar />
    <div class="row mr-0 ml-0">
      <Calendar class="col" />
    </div>
    <hr />
    <div class="row mr-0 ml-0">
      <TaskList class="col-sm" />
      <EventList class="col-sm" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TaskList from "./components/Task/TaskList.vue";
import Calendar from "./components/Day/Calendar.vue";
import Navbar from "./components/Navbar.vue";
import TaskModal from "./components/Task/TaskModal.vue";
import vxm from "./store/index.vuex";
import SettingsModal from "./components/SettingsModal.vue";
import DayModal from "./components/Day/DayModal.vue";
import ChunkModal from "./components/ChunkModal.vue";
import EventList from "./components/Event/EventList.vue";

@Component({
  components: {
    TaskList,
    Calendar,
    Navbar,
    TaskModal,
    SettingsModal,
    DayModal,
    ChunkModal,
    EventList,
  },
})
export default class App extends Vue {
  get vxm(): typeof vxm {
    return vxm;
  }

  mounted() {
    window.addEventListener("keypress", (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "n":
          this.newTask();
          break;
        case "s":
          this.$bvModal.show("settings-modal");
          break;
      }
    });
  }

  newTask() {
    vxm.store.editedIndex = -1;
    this.$bvModal.show("settings-modal");
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

@include media-breakpoint-down(sm) {
  .day {
    border-right: 1px solid gray;
  }
}

hr {
  background-color: $secondary-lightened !important;
  border-color: $secondary-lightened !important;
}

.invalid-day {
  background-color: $secondary-darkened;
}

.day:hover {
  background-color: $secondary-lightened;
}

.chunk:hover {
  background-color: $primary-darkened !important;
}
</style>
