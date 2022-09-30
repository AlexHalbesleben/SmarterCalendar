import Chunk from "@/types/Chunk";
import UserEvent from "@/types/Event";
import UserReminder from "@/types/Reminder";
import Settings from "@/types/Settings";
import Vue from "vue";
import Vuex from "vuex";
import {
  createModule,
  action,
  extractVuexModule,
  createProxy,
} from "vuex-class-component";
import UserTask from "../types/Task";
import ChunkStore from "./ChunkStore";
import ModalsStore from "./modals/ModalsStore";

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "store",
  strict: false,
});

export class Store extends VuexModule {
  tasks: UserTask[] = []; // The user's tasks

  completedTasks: UserTask[] = [];
  completedChunks: Chunk[] = [];

  events: UserEvent[] = [];

  reminders: UserReminder[] = [];

  chunks = new ChunkStore(this);

  settings: Settings = new Settings({});

  modals = new ModalsStore(this);

  @action async uploadTasks() {
    localStorage["tasks"] = JSON.stringify(this.tasks);
  }

  @action async uploadSettings() {
    localStorage["settings"] = JSON.stringify(this.settings);
  }

  @action async uploadEvents() {
    localStorage["events"] = JSON.stringify(this.events);
  }

  @action async uploadCompleted() {
    localStorage["completed"] = JSON.stringify(this.completedChunks);
  }

  @action async uploadReminders() {
    localStorage["reminders"] = JSON.stringify(this.reminders);
  }

  constructor() {
    super();

    if (localStorage["tasks"]) {
      this.tasks = JSON.parse(localStorage["tasks"]).map((task: UserTask) => {
        return {
          ...task,
          due: new Date(task.due),
          startDate: task.startDate ? new Date(task.startDate) : null,
          lockedChunks: task.lockedChunks.map((lockedChunk) => {
            return {
              date: new Date(lockedChunk.date),
              number: lockedChunk.number,
            };
          }),
        };
      });
    }

    if (localStorage["settings"]) {
      this.settings = new Settings(JSON.parse(localStorage["settings"]));
    }

    if (localStorage["events"]) {
      this.events = JSON.parse(localStorage["events"]).map(
        (event: UserEvent) =>
          new UserEvent({
            date: new Date(event.date),
            name: event.name,
            duration: event.duration,
            description: event.description,
          })
      );
    }

    if (localStorage["completed"]) {
      this.completedChunks = JSON.parse(localStorage["completed"]).map(
        (chunk: Chunk) =>
          new Chunk(
            new UserTask({
              ...chunk.task,
              due: new Date(chunk.task.due),
              startDate: chunk.task.startDate
                ? new Date(chunk.task.startDate)
                : null,
            }),
            chunk.duration,
            new Date(chunk.date),
            chunk.number
          )
      );
    }

    if (localStorage["reminders"]) {
      this.reminders = JSON.parse(localStorage["reminders"]).map(
        (reminder: UserReminder) =>
          new UserReminder({
            date: new Date(reminder.date),
            name: reminder.name,
            description: reminder.description,
          })
      );
    }

    this.completedTasks = this.completedChunks
      .map((chunk) => chunk.task)
      .filter((task) => !this.tasks.includes(task));

    // try {
    this.chunks.update();
    /* } catch (e) {
      if (e instanceof Error) {
        alert(`ERROR: ${e.name}`);
        alert(`message: ${e.message}`);
        alert(`stack:\n ${e.stack}`);
        alert(`cause: ${e.cause}`);

        this.tasks.sort((a, b) => a.due.getTime() - b.due.getTime());
      }
    } */
  }
}

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(Store),
  },
});

// Creating proxies.
const vxm = {
  store: createProxy(store, Store),
};

export default vxm;
