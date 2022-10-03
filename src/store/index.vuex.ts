import Chunk from "@/types/Chunk";
import UserEvent from "@/types/Event";
import UserReminder from "@/types/Reminder";
import Settings from "@/types/Settings";
import IDUtils from "@/util/IDUtils";
import Vue from "vue";
import Vuex from "vuex";
import {
  createModule,
  extractVuexModule,
  createProxy,
} from "vuex-class-component";
import UserTask from "../types/Task";
import ChunkStore from "./ChunkStore";
import ModalsStore from "./modals/ModalsStore";
import StorageStore from "./storage/StorageStore";

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

  storage = new StorageStore(this);

  constructor() {
    super();

    IDUtils.store = this;

    this.tasks = this.storage.tasks.value;
    this.settings = this.storage.settings.value;
    this.events = this.storage.events.value;
    this.completedChunks = this.storage.completed.value;
    this.reminders = this.storage.reminders.value;

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
