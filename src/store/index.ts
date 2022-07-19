import Chunk from "@/types/Chunk";
import DateUtils from "@/util/DateUtils";
import Vue from "vue";
import Vuex from "vuex";
import {
  createModule,
  mutation,
  action,
  extractVuexModule,
  createProxy,
} from "vuex-class-component";
import UserTask from "../types/Task";

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "store",
  strict: false,
});

export class Store extends VuexModule {
  tasks: UserTask[] = []; // The user's tasks

  editedIndex = -1; // -1 indicates a new task is being created (as opposed to an existing one being edited)

  chunks: Chunk[] = [];

  @mutation
  updateChunks() {
    // Each day is referenced by a number (the number of days after the current day) and has a list of chunks
    const chunksByDay: Record<number, Chunk[]> = {};

    for (const task of this.tasks) {
      const { chunks, due } = task;
      const daysUntilDue = DateUtils.daysBetween(DateUtils.currentDate, due);

      for (let i = 0; i < chunks; i++) {
        const dayToAssign = daysUntilDue - (daysUntilDue % (i + 1));
        console.log(dayToAssign);

        if (!chunksByDay[dayToAssign]) {
          chunksByDay[dayToAssign] = [];
        }
        chunksByDay[dayToAssign].push(
          new Chunk(
            task,
            task.duration / chunks,
            DateUtils.applyDayOffset(dayToAssign, DateUtils.currentDate)
          )
        );
      }
    }

    this.chunks = (Object.values(chunksByDay) as Chunk[][]).flat(1);
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
