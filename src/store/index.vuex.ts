import Chunk from "@/types/Chunk";
import Settings from "@/types/Settings";
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

  settings: Settings = new Settings();

  /**
   * Splits the tasks into chunks
   */
  @mutation
  updateChunks() {
    // Each day is referenced by a number (the number of days after the current day) and has a list of chunks
    const chunksByDay: Record<number, Chunk[]> = {};

    const getTotalTime = (day: Chunk[]) =>
      day.reduce((prev, curr) => prev + curr.duration, 0);

    // TODO: Tasks should have a priority and higher-priority tasks are scheduled first
    // For each task
    for (const task of this.tasks) {
      const { chunks, due } = task;
      const daysUntilDue = DateUtils.daysBetween(DateUtils.currentDate, due);
      const chunkDuration = task.duration / task.chunks;

      // For each chunk
      for (let i = 0; i < chunks; i++) {
        let dayToAssign = -1; // Default value if no days are optimal

        // Goes through each day that the chunk could be assigned, counting backwards
        for (let day = daysUntilDue; day >= 0; day--) {
          chunksByDay[day] = chunksByDay[day] ?? []; // Makes sure all the days we'll be accessing exist
          if (day != 0 && !chunksByDay[day - 1]) {
            // Makes sure the day before exists
            chunksByDay[day - 1] = [];
          }

          const dayTotalTime = getTotalTime(chunksByDay[day]);
          // If the time spent on chunks that day is already more than the max, don't assign it on th at day
          if (
            dayTotalTime + chunkDuration >
            this.settings.maxPreferredDailyTime
          ) {
            continue;
          }

          // If the time spent on chunks is enough more than the previous day, don't assign on that day
          if (
            day !== 0 &&
            dayTotalTime + chunkDuration - getTotalTime(chunksByDay[day - 1]) >=
              this.settings.maxPreferredDayTimeDiff
          ) {
            continue;
          }

          // If the day will work (read: it passed the previous checks), assign it
          dayToAssign = day;
          break; // Don't keep going
        }

        // -1 indicates that no days were ideal. In this case, pick the day with the least work
        if (dayToAssign === -1) {
          let bestDay = 0;
          for (let day = 0; day <= daysUntilDue; day++) {
            if (
              getTotalTime(chunksByDay[day]) <=
              getTotalTime(chunksByDay[bestDay])
            ) {
              bestDay = day;
            }
          }
        }

        // Avoids errors (if there are no tasks/chunks)
        chunksByDay[dayToAssign] = chunksByDay[dayToAssign] ?? [];

        // Create the chunk and add it to the list
        chunksByDay[dayToAssign].push(
          new Chunk(
            task,
            chunkDuration,
            DateUtils.applyDayOffset(dayToAssign, DateUtils.currentDate)
          )
        );
      }
    }

    // Get the values of the chunksByDay object (a nested array of Chunks) and flatten
    this.chunks = (Object.values(chunksByDay) as Chunk[][]).flat(1);
  }

  @action
  async uploadTasks() {
    localStorage["tasks"] = JSON.stringify(this.tasks);
  }

  @action
  async uploadSettings() {
    localStorage["settings"] = JSON.stringify(this.settings);
  }

  constructor() {
    super();

    if (localStorage["tasks"]) {
      const retrievedData: {
        name: string;
        chunks: string;
        duration: number;
        due: string;
      }[] = JSON.parse(localStorage["tasks"]);

      this.tasks = retrievedData.map((task) => {
        return {
          name: task.name,
          chunks: parseInt(task.chunks),
          duration: task.duration,
          due: new Date(task.due),
        };
      });

      this.updateChunks();
    }

    if (localStorage["settings"]) {
      const settings: {
        maxPreferredDailyTime: string | number;
        maxPreferredDayTimeDiff: string | number;
      } = JSON.parse(localStorage["settings"]);

      this.settings.maxPreferredDailyTime = parseInt(
        settings.maxPreferredDailyTime.toString()
      );
      this.settings.maxPreferredDayTimeDiff = parseInt(
        settings.maxPreferredDayTimeDiff.toString()
      );
    }
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
