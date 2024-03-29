<template>
  <div id="app" class="container-fluid h-100 pr-0 pl-0">
    <TaskModal />
    <SettingsModal />
    <DayModal />
    <ChunkModal />
    <EventModal />
    <HelpModal />
    <ChangelogModal ref="changelogModal" />
    <ReminderModal />
    <div id="content">
      <Navbar />
      <div class="row mr-0 ml-0">
        <Calendar class="col" />
      </div>
      <hr />
      <div class="row mr-0 ml-0 last-row">
        <TaskList class="col-sm" />
        <EventList class="col-sm" />
        <ReminderList class="col-sm" />
      </div>
      <Footer />
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
import EventModal from "./components/Event/EventModal.vue";
import Footer from "@/components/Footer.vue";
import HelpModal from "./components/HelpModal.vue";
import ChangelogModal from "./components/ChangelogModal.vue";
import ReminderModal from "./components/Reminder/ReminderModal.vue";
import ReminderList from "./components/Reminder/ReminderList.vue";

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
    EventModal,
    Footer,
    HelpModal,
    ChangelogModal,
    ReminderModal,
    ReminderList,
  },
})
export default class App extends Vue {
  get vxm(): typeof vxm {
    return vxm;
  }

  mounted() {
    window.addEventListener("keyup", (ev: KeyboardEvent) => {
      const changelogModal = this.$refs.changelogModal as ChangelogModal;

      let fn = (
        {
          t: () => this.newTask(),
          e: () => this.newEvent(),
          r: () => this.newReminder(),
          s: () => this.$bvModal.show("settings-modal"),
          h: () => this.$bvModal.show("help-modal"),
          ArrowRight: () => {
            if (vxm.store.modals.changelog.shown) {
              changelogModal.forwardVersion();
            }
          },
          ArrowLeft: () => {
            if (vxm.store.modals.changelog.shown) {
              changelogModal.backVersion();
            }
          },
        } as Record<string, () => void>
      )[ev.key];

      if (fn) fn();
    });
  }

  newTask() {
    vxm.store.modals.task.index = -1;
    vxm.store.modals.task.completed = false;
    this.$bvModal.show("task-modal");
  }

  newEvent() {
    vxm.store.modals.event.index = -1;
    this.$bvModal.show("event-modal");
  }

  newReminder() {
    vxm.store.modals.reminder.index = -1;
    this.$bvModal.show("reminder-modal");
  }
}
</script>

<style lang="scss">
@import "./style/style.scss";

body {
  background-color: $secondary !important;
}

#content {
  margin-top: 56px;
}

@include media-breakpoint-up(sm) {
  .day {
    min-height: 100px;
  }
  .day:not(:last-child) {
    border-right: 0 !important;
  }
  .row > .day:last-child {
    border-right: 1px solid !important;
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

.completed-chunk:hover {
  background-color: $warning-darkened !important;
}

.event {
  background-color: $info;
  color: $dark;
}

.event:hover {
  background-color: $info-darkened;
}

.reminder:hover {
  background-color: $quaternary-darkened !important;
}

input[type="radio"] + span {
  color: $dark !important;
}

.last-row {
  margin-bottom: 5%;
}
</style>
