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

  /**
   * Splits the tasks into chunks
   */
  @mutation
  updateChunks() {
    // Each day is referenced by a number (the number of days after the current day) and has a list of chunks
    const chunksByDay: Record<number, Chunk[]> = {};

    // TODO: Tasks should have a priority and higher-priority tasks are scheduled first
    // For each task
    for (const task of this.tasks) {
      const { chunks, due } = task;
      const daysUntilDue = DateUtils.daysBetween(DateUtils.currentDate, due);

      // For each chunk
      for (let i = 0; i < chunks; i++) {
        // Assign on the due date, then on the day before, and so on. When you can't go back, wrap around at the end date again
        const dayToAssign = daysUntilDue - (daysUntilDue % (i + 1));

        // Create day in object if it doesn't exist
        if (!chunksByDay[dayToAssign]) {
          chunksByDay[dayToAssign] = [];
        }
        // Create the chunk and add it to the list
        chunksByDay[dayToAssign].push(
          new Chunk(
            task,
            task.duration / chunks,
            DateUtils.applyDayOffset(dayToAssign, DateUtils.currentDate)
          )
        );
      }
    }

    // Get the values of the chunksByDay object (a nested array of Chunks) and flatten
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
